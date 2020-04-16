// This isn't necessary but it keeps the editor from thinking L and carto are typos
/* global L, carto */

var map = L.map('map', {
  center: [30, 0],
  zoom: 2.3
});

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  maxZoom: 18
}).addTo(map);

// Initialize Carto
var client = new carto.Client({
  apiKey: 'default_public',
  username: 'nataliavega'
});

// Initialze source data
var merchandexpsource = new carto.source.SQL('SELECT * FROM merchandise_exports');

// Create style for the data
var merchandexpstyle = new carto.style.CartoCSS(`
#layer {
  polygon-fill: ramp([clothing_e], (#f9ddda, #eda8bd, #ce78b3, #9955a8, #573b88), jenks);
  polygon-opacity: 1
}
#layer::outline {
  line-width: 1;
  line-color: #FFFFFF;
  line-opacity: 0.5;
}
`);

// Add style to the data
var merchandexplayer = new carto.layer.Layer(merchandexpsource, merchandexpstyle);

var merchandimpsource = new carto.source.SQL('SELECT * FROM merchandise_imports');
var merchandimpstyle = new carto.style.CartoCSS(`
#layer {
  polygon-opacity: 0;
  polygon-fill: ramp([clothing_2], (#b0f2bc, #77e2a8, #4cc8a3, #31a6a2, #257d98), jenks);
}
#layer::outline {
  line-width: 1;
  line-color: #FFFFFF;
  line-opacity: 0.5;
}
`);

var merchandimplayer = new carto.layer.Layer(merchandimpsource, merchandimpstyle);

var HMmanufsource = new carto.source.SQL('SELECT * FROM hm_manufacturesfactories');
var HMmanustyle = new carto.style.CartoCSS(`
#layer {
  marker-width: ramp([avg_no_wks], range(5, 33), jenks(5));
  marker-fill: #ba1536;
  marker-fill-opacity: 0.9;
  marker-allow-overlap: true;
  marker-line-width: 1;
  marker-line-color: #f9f1f1;
  marker-line-opacity: 1;
}
`);
var HMmanulayer = new carto.layer.Layer(HMmanufsource, HMmanustyle);

var HMstoresource = new carto.source.SQL('SELECT * FROM hm_stores_');
var HMstorestyle = new carto.style.CartoCSS(`
#layer {
  marker-width: ramp([net_sales_2019_sek_m], range(2, 39), jenks(5));
  marker-fill: #c7bdc2;
  marker-fill-opacity: 0.9;
  marker-allow-overlap: true;
  marker-line-width: 1;
  marker-line-color: #ffffff;
  marker-line-opacity: 0.6;
}
`);

var HMstorelayer = new carto.layer.Layer(HMstoresource, HMstorestyle);

var HMheadqsource = new carto.source.SQL ('SELECT * FROM hm_headquarters');
var HMheadqstyle = new carto.style.CartoCSS(`
#layer {
  marker-width: 45;
  marker-fill: #63071a;
  marker-fill-opacity: 0.9;
  marker-file: url('https://s3.amazonaws.com/com.cartodb.users-assets.production/production/nataliavega/assets/20200406011226H%26Mlogo.png');
  marker-allow-overlap: true;
  marker-line-width: 1;
  marker-line-color: #FFFFFF;
  marker-line-opacity: 1;
}
`);
var HMheadqlayer = new carto.layer.Layer(HMheadqsource, HMheadqstyle);

var minwagessource = new carto.source.SQL('SELECT * FROM minimum_wages_2')
var minwagesstyle = new carto.style.CartoCSS(`
#layer {
  polygon-opacity:0;
  polygon-fill: ramp([minwage_13], (#fef6b5, #ffd08e, #ffa679, #f67b77, #e15383), jenks);
}
#layer::outline {
  line-width: 1;
  line-color: #FFFFFF;
  line-opacity: 0.5;
}
`);
var minwageslayer = new carto.layer.Layer(minwagessource,minwagesstyle);

var unionsource= new carto.source.SQL('SELECT * FROM union_membership_2')
var unionstyle= new carto.style.CartoCSS(`
#layer {
  polygon-fill: ramp([union_memb], (#f4e2e0, #eca59d, #ec786b, #e74937, #ec1b03), jenks);
}
#layer::outline {
  line-width: 1;
  line-color: #dbd1d1;
  line-opacity: 0.6;
}
`);
var unionlayer = new carto.layer.Layer(unionsource,unionstyle);

var rdsource = new carto.source.SQL('SELECT * FROM rsearchdevelopment_4')
var rdstyle = new carto.style.CartoCSS(`
#layer {
  polygon-opacity: 0;
  polygon-fill: ramp([latest_rec], (#eff3ff, #bdd7e7, #6baed6, #3182bd, #08519c), jenks);
}
#layer::outline {
  line-width: 1;
  line-color: #FFFFFF;
  line-opacity: 0.5;
}
`);

var rdlayer = new carto.layer.Layer(rdsource,rdstyle);

var HMmanufButton = document.querySelector('.HMmanuf-button');

// Step 2: Add an event listener to the button. We will run some code whenever the button is clicked.
HMmanufButton.addEventListener('click', function (e) {
  HMmanufsource.setQuery(`SELECT * FROM hm_manufacturesfactories
WHERE product_type ILIKE '%JERSEY%' 
   OR product_type ILIKE '%KNITTED%'
   OR product_type ILIKE '%NIGHT WEAR%'
   OR product_type ILIKE '%SWIMWEAR%'
   OR product_type ILIKE '%UNDERWEAR%'
   OR product_type ILIKE '%SOCKS%' 
   OR product_type ILIKE '%TIGHTS%' 
   OR product_type ILIKE '%MICRO-TIGHTS%'
   OR product_type ILIKE '%TIGHTS%' 
   OR product_type ILIKE '%WOVEN%'`);
  });
  
  
  // Sometimes it helps to log messages, here we log to let us know the button was clicked. You can see this if you open developer tools and look at the console.
  console.log('HMmanuf button was clicked');




// Add the data to the map as two layers. Order matters here--first one goes on the bottom
client.addLayers([rdlayer,unionlayer,minwageslayer,merchandimplayer,merchandexplayer,HMmanulayer,HMstorelayer, HMheadqlayer]);
client.getLeafletLayer().addTo(map);

 //Step 1: Find the dropdown by class. If you are using a different class, change this.
var layerPicker = document.querySelector('.layer-picker');

// Step 2: Add an event listener to the dropdown. We will run some code whenever the dropdown changes.
layerPicker.addEventListener('change', function (e) {
  // The value of the dropdown is in e.target.value when it changes
  var exproduct = e.target.value;
  
  // Step 3: Decide on the SQL query to use and set it on the datasource
  if (exproduct === 'all') {
    // If the value is "all" then we show all of the features, unfiltered
    merchandimpsource.setQuery("SELECT * FROM merchandise_exports");
  }
  else {
    // Else the value must be set to a life stage. Use it in an SQL query that will filter to that life stage.
    merchandexpsource.setQuery("SELECT * FROM merchandise_exports WHERE life_stage = '" + lifeStage + "'");
  }
  
  // Sometimes it helps to log messages, here we log the lifestage. You can see this if you open developer tools and look at the console.
  console.log('Dropdown changed to "' + lifeStage + '"');
});
