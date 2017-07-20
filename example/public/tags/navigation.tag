<naviTree>

    <ul class="docs-nav nav">
        <li each={opts.nav} if={cat} class="nav-item">
            <a href="#{ cat }" onclick={category} class="pure-menu-link">{ name }
                <small class="float-right">{count}</small>
            </a>
            <naviTree if={children && window.location.hash.indexOf(cat) !== -1} nav="{children}"></naviTree>
        </li>
    </ul>

    <script>
        this.category = (e) => {
            e.preventDefault();
            window.location.hash = e.item.cat;
            riot.catalog.trigger('query','navigation',{'categories':'"' + e.item.cat + '"'});
        }
    </script>

</naviTree>

<navigation>

    <div if={navigation} class="accordion">
        <div  class="accordion-item">
            <input type="checkbox" id="accordion-price" name="accordion-checkbox" hidden="" checked="">
            <label class="accordion-header hand" for="accordion-price">
                Categories
            </label>
            <div class="accordion-body">
                 <naviTree nav="{navigation}" countRef={categoryCount}></naviTree>
            </div>
        </div>
    </div>

    <script>
        var self = this;
        self.navigation = [];
        self._navigation = [];
        self.categories = [];
        self.categoryCount = {};

        riot.catalog.on('got_data', function(data, filterQuery){
            self.data = data;
            self.filterQuery = filterQuery;
            if(self.navigation.length == 0 ) {
                self.navigation = self.getCategoryTree(self.data.facet.Categories);
                self._navigation = self.navigation;
            } else {

                if(typeof self.filterQuery.$search == 'string') {
                    self.navigation = self.getCategoryTree(self.data.facet.Categories);
                } else {
                    self.navigation = self._navigation;
                }
                // console.log(self.data.facet.Categories.buckets)

            }
            self.update();
        })

        this.getCategoryTree = (categories) => {
                var catList = [];
                var catTree = [];

                categories.buckets.forEach(function(c,i){
                    var cTree = c.val.split('/');
                    var ct = {
                        name: cTree[cTree.length-1],
                        cat: c.val,
                        path: cTree,
                        parentId: i,
                        count: c.count,
                        len: cTree.length
                    };
                    cTree.pop();
                    ct.parent = cTree.join('/');
                    catList.push(ct);

                    categories.buckets[i].val = c.val;
                })

                catList = catList.sort(function(a, b) {
                    return parseFloat(b.len) - parseFloat(a.len);
                });
                self.categories = catList;
                catList.forEach(function(current,iCurrent){
                    catList.forEach(function(c,i){
                        if(c.cat == current.parent) {
                            if(typeof catList[i].children == 'undefined') {
                                catList[i].children = [];
                            }
                            catList[i].children.push(current);
                            delete catList[iCurrent];
                        }

                    })
                })
                catTree = catList.pop().children;
                catTree = catTree.sort(function(a, b) {
                    return parseFloat(b.count) - parseFloat(a.count);
                });
                // console.log('catTree',catTree)

                return catTree;
        }

    </script>

    <style>
        .nav .nav-item a {
        color: #727e96;
        padding: 0 .8rem;
        text-decoration: none;
        display: block;
    }
    </style>

</navigation>