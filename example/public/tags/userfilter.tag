<userfilter>
    <h3>
        <a href="#cards" class="anchor" aria-hidden="true">#</a><b if={data && data.total}>{data.total}</b> &nbsp;<small if={data} class="badge" data-badge="{data.QTime} ms" >Products</small>
    </h3>
    <div>
        <label each={val, key in filterQuery} if={key != '$skip'} class="chip">
            {val.replace(/\"/g,'').replace(/\//g,' ').replace('Default Category','')}
            <button onclick={removeFilter} class="btn btn-clear"></button>
        </label>
    </div>

    <script>
        var self = this;

        this.removeFilter = (e) => {
            delete this.filterQuery[e.item.key];
            riot.catalog.trigger('query','filter',this.filterQuery);
        }

        riot.catalog.on('got_data', (data, filterQuery) => {
            self.data = data;
            self.filterQuery = filterQuery;
            self.update();
        })
    </script>

</userfilter>