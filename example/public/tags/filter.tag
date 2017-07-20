<raw>
  <span></span>
  this.root.innerHTML = opts.content
</raw>

<filter>

    <div class="accordion">
        <div  class="accordion-item">
            <input type="checkbox" id="accordion-price" name="accordion-checkbox" hidden="" checked="">
            <label class="accordion-header hand" for="accordion-price">
                Price
            </label>
            <div class="accordion-body">
                <input class="slider" onchange={slider} type="range" min="0" max="100" value="{price}" />
            </div>
        </div>
    </div>

    <div if={data} >
        <div class="accordion" each={facet, name in data.facet}>
            <div  if={facet.buckets && facet.buckets.length > 0} class="accordion-item">
                <input type="checkbox" id="accordion-{ name }" name="accordion-checkbox" hidden="" checked="">
                <label class="accordion-header hand" for="accordion-{ name }">
                    { name }
                </label>
                <div class="accordion-body">
                    <ul>
                        <li if={facet && facet.buckets} each={facet.buckets}>
                            <label for={ val }  class="form-checkbox block">
                               <input onchange={filter} type="checkbox" checked="{checked: filterQuery[name] && filterQuery[name] == val}" name="{ val }" data-filter="{parent.name}" id="{ val }" value="{val}">
                               <i class="form-icon"></i> <raw content="{ val }"/> <small class="float-right">{count}</small>
                            </label>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <script>
        var self = this;

        riot.catalog.on('got_data', (data, filterQuery) =>{
            self.data = data;
            delete self.data.facet.Categories;
            delete self.data.facet.count;
            self.filterQuery = filterQuery;
            self.price = 100;
            if(filterQuery.price) {
                self.price = parseInt(filterQuery.price.replace('[0 TO ','').replace(']',''));
            }
            self.update();
        })

        this.slider = (e) => {
            this.filterQuery['price'] = '[0 TO ' + e.target.value + ']';
            riot.catalog.trigger('query','filter',this.filterQuery);
        }

        this.filter = (e) => {
            if(e.target.getAttribute('checked') === 'checked') {
                if(typeof this.filterQuery[e.target.getAttribute('data-filter')] !== 'undefined') {
                   delete this.filterQuery[e.target.getAttribute('data-filter')];
                }
            } else {
                this.filterQuery[e.target.getAttribute('data-filter')] = e.target.value;
            }

            riot.catalog.trigger('query','filter',this.filterQuery);
        }
    </script>

    <style>
        .accordion ul {
            list-style: none;
            margin: 0;
            padding: 0;
        }

        .accordion > div > label {
            text-transform: uppercase;
            font-weight: bold;
        }
        .custom-restricted{
            height: 280px;
            border: 1px #ffffff solid ;
            border-radius: 4px;
        }

        .accordion .accordion-item input:checked~.accordion-body {
            max-height: 195px;
            overflow-y: scroll;
        }

    </style>


</filter>