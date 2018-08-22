<pagination>

    <ul class="pagination float-right">

        <li if={pagination.start} class="page-item {active: pagination.start == pagination.current }">
            <a href="#" onclick={paginate} data-page="{pagination.start}" type="a" >{pagination.start}</a>
        </li>
        <li c each={page in pagination.range} class="page-item {active: page == pagination.current }">
            <a href="#" onclick={paginate} type="a" data-page="{page}" >{page}</a>
        </li>
        <li if={pagination.end} class="page-item {active: pagination.end == pagination.current }">
            <a href="#" onclick={paginate} data-page="{pagination.end}" type="a" >{pagination.end}</a>
        </li>
        <li>
            <select onchange={items} class="form-select select-sm">
                <option>Items</option>
                <option>10</option>
                <option>50</option>
                <option>10000</option>
              </select>
        </li>

    </ul>

    <script>
        var self = this;
        self.pagination = [];

        riot.catalog.on('got_data', (data, filterQuery) => {
            self.data = data;
            self.filterQuery = filterQuery;
            self.initPagination();
        })

        this.items = (e) => {
            self.filterQuery.$skip = 0;
            self.filterQuery.$limit = e.target.value || 50;
            riot.catalog.trigger('query','pagination',this.filterQuery);
        }

        this.paginate = (e) => {
            e.preventDefault();
            self.filterQuery.$skip = (parseInt(e.target.getAttribute('data-page')) * self.data.limit);
            riot.catalog.trigger('query','pagination',this.filterQuery);
        }

        self.initPagination = () => {
            self.next = 2;
            let current = (Math.ceil(self.data.skip/self.data.limit)) || 1;
            let start = 1;
            let end = (Math.ceil(self.data.total/self.data.limit))-1;
            let nextTo = 2;
            let rangeStart = current - nextTo;
            let rangeEnd = current + nextTo;

            if(rangeStart <= 0) {
                rangeStart = start;
            }
            if(rangeEnd >= end) {
                rangeEnd = end;
            }

            self.pagination = {
                start:rangeStart == start ? false : 1,
                rangeStart:rangeStart,
                current:current,
                rangeEnd:rangeEnd,
                range:[],
                end:rangeEnd == end ? false : end
            };

            for (var i = rangeStart; i <= rangeEnd; i++) {
                self.pagination.range.push(i);
            }
            self.update();
        }

    </script>

</pagination>