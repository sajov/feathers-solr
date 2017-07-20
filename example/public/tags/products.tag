<products>

    <div if={!data || data.data.length == 0} class="empty">
        <div class="empty-icon">
            <i class="icon icon-stop"></i>
        </div>
        <h4 class="empty-title">Sorry no Products found</h4>
        <p class="empty-subtitle">Click the button to reset your search.</p>
        <div class="empty-action">
            <button class="btn btn-primary" onclick={reset}>Reset</button>
        </div>
    </div>


    <section id="cards" class="container" if={data && data.data.length > 0} >

        <div class="columns">
            <div class="column col-3 col-xs-6" each={data.data}>
                <div class="card">
                    <div class="card-image">
                        <img class="img-responsive" riot-src={ '/img/mage' + image } />
                    </div>
                    <div class="card-header">
                        <div class="card-title">{ name }</div>
                        <div if={categories} class="card-subtitle">{categories.pop().replace(/\//g,' ')}</div>
                    </div>
                    <div class="card-body">
                        $ {price}
                    </div>
                </div>
            </div>
        </div>

    </section>

    <script>
        var self = this;

        riot.catalog.on('got_data', (data, filterQuery) => {
            self.data = data;
            self.filterQuery = filterQuery;
            self.update();
        })

        self.reset = () => {
            riot.catalog.trigger('query','filter',{});
        }

    </script>

</products>