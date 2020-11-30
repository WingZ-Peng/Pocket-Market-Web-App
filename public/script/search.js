$('#pocketMarket-search').on('input', function() {
    var search = $(this).serialize();
    if(search === "search=") {
      search = "all"
    }
    $.get('/pocketMarkets?' + search, function(data) {
      $('#pocketMarket-grid').html('');
      data.forEach(function(pocketMarket) {
        $('#pocketMarket-grid').append(`
          <div class="col-md-3 col-sm-6">
            <div class="thumbnail">
              <img src="${ pocketMarket.image }">
              <div class="caption">
                <h4>${ pocketMarket.name }</h4>
              </div>
              <p>
                <a href="/pocketMarkets/${ pocketMarket._id }" class="btn btn-primary">More Information</a>
              </p>
            </div>
          </div>
        `);
      });
    });
  });
  
  $('#pocketMarket-search').submit(function(event) {
    event.preventDefault();
  });