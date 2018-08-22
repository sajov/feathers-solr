<raw>
    <span></span>
    this.root.innerHTML = opts.content
</raw>

<autocomplete>

      <!-- form input with loading icon -->
        <div class="has-icon-right">
          <input  id="acinput" onkeyup="{ search }" type="text" class="form-input input-lg" placeholder="enter your search" />
          <i if={hasFocus} class="form-icon loading"></i>
        </div>
         <div class="form-autocomplete">
              <!-- autocomplete suggestion list -->
             <!--  <ul class="menu">
                <li class="menu-item">
                  <a href="#">
                    <div class="tile tile-centered">
                      <div class="tile-icon">
                        <img src="img/avatar-4.png" class="avatar avatar-sm" alt="Steve Rogers" />
                      </div>
                      <div class="tile-content">
                        Steve Rogers
                      </div>
                    </div>
                  </a>
                </li>
              </ul> -->
            </div>

    <div if={dasd} show={this.suggestions} id="suggestions">
        <input name="acinput" placeholder="enter your search" id="acinput" onkeyup="{ search }" />
        <i class="icon">&#9906;</i>
        <!-- <i>&#8981;</i> -->
        <ul show={suggestions.length > 0 || spellcheck.length > 0}>
            <li if={spellcheck.length > 0}>
                <span><b>Did you mean: <i>{ spellcheck[0].word }</i> ?</b></span>
            </li>
            <li each={suggest, i in suggestions} onclick="{ parent.selected }" class="{ active: parent.active==i}">
                <!-- <span>{ suggest.term }</span> -->
                <raw content="{ suggest.term }"/>
            </li>
        </ul>
    </div>

    <script>
        this.suggestions = []
        this.spellcheck = []
        this.active = -1

        this.on('mount', function(){
            this.rest = window.client.service('solr');
        })

        this.on('mount', function(){
            setTimeout(function(){document.getElementById("acinput").focus()},1000);
        })

        this.search = (e) =>  {
            var self = this;
            self.hasFocus = true;
            if(e.target.value.length < this.min) {
                // this.filtered = []
                this.active = -1
                return
            }

            if(e.which == 40 && self.suggestions.length) { // down
                this.active = Math.min(this.active+1, self.suggestions.length-1)
                console.log('findthis.active',this.active);
                return
            }

            if(e.which == 38 && self.suggestions.length) { // up
                console.log('findthis.active',this.active);
                this.active = Math.max(this.active-1, 0)
                return
            }

            if(e.which == 13) { // enter
                // self.suggestions.length && this.selection(self.suggestions[this.active])
                alert('escaoe');
            }

            if(e.which == 27) { // escape
                alert('escaoe')
            }
            this.active=-1

            window.location.hash = '';
            var query = {};
            if(e.target.value != ""){
                query = {$search: e.target.value};
            }
            riot.catalog.trigger('query','autocomplete',query);
            // riot.catalog.trigger('filter',{$search:e.target.value + ' ' + e.target.value.split(' ').pop()+'*'});

        }

    </script>



</autocomplete>