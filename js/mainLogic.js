$(function() {

  Parse.$ = jQuery;
  // Initialize Parse with your Parse application javascript keys
  Parse.initialize("1yMkKfOLib2E325B0MTShFnat6RoS1HbJcg06JK8", "emTBGRvoSX1tDG17AKdXq7JJenNFJs6YaLkX2TeO");

  var accessKeys = Parse.Object.extend("AccessKeys");
  var currentAccessObject = new accessKeys();
  var emailAddress = undefined;
  var appAccessCode = undefined;
  var showInvoiced = false;
 
  
  //Define the class as a backbone.Model
  var Baling = Parse.Object.extend("Baling", {
	  defaults: {
		AccessKey: appAccessCode,
		Employee: "",
		Customer: "",
		FarmLocation: "",
		FieldName: "",
		StrawType: "",
		NofBales: "",
		BalerN: "",
		BalerStartN: "",
		BalerEndN: "",
		Size: "",
		EndUser: "",
		Comments: "",
		createdAt: Date.now(),
		invoiced: false,
	  },
	  
	  		sort_key: 'id',
		comparator: function(a) {
			return a.get(this.sort_key);
		},
		sortByField: function(fieldName) {
			this.sort_key = fieldName;
			this.sort();
		},
		
      initialize: function() {
		  // Ensure that each baling job created has `content`.
		  if (!this.get("content")) {
			this.set({"content": this.defaults.content});
		  }
		  this.set({"AccessKey": appAccessCode});
      },
  });
  var Delivery = Parse.Object.extend("Delivery", {
	  defaults: {
		AccessKey: appAccessCode,
		Employee: "",
		Customer: "",
		PickUpLocation: "",
		DeliveryLocation: "",
		NofBales: "",
		Size: "",
		StrawType: "",
		Comments: "",
		createdAt: Date.now(),
		invoiced: false,
	  },
	  		sort_key: 'id',
		comparator: function(a) {
			return a.get(this.sort_key);
		},
		sortByField: function(fieldName) {
			this.sort_key = fieldName;
			this.sort();
		},
      initialize: function() {
		  // Ensure that each baling job created has `content`.
		  if (!this.get("content")) {
			this.set({"content": this.defaults.content});
		  }
		  this.set({"AccessKey": appAccessCode});
      },
  });
  var Loading = Parse.Object.extend("Loading", {
	  defaults: {
		AccessKey: appAccessCode,
		Employee: "",
		Customer: "",
		Farm: "",
		StrawType: "",
		Haulier: "",
		RegistrationN: "",
		NofBales: "",
		Size: "",
		EndUser: "",
		Comments: "",
		createdAt: Date.now(),
		invoiced: false,
	  },
	  		sort_key: 'id',
		comparator: function(a) {
			return a.get(this.sort_key);
		},
		sortByField: function(fieldName) {
			this.sort_key = fieldName;
			this.sort();
		},
      initialize: function() {
		  // Ensure that each baling job created has `content`.
		  if (!this.get("content")) {
			this.set({"content": this.defaults.content});
		  }
		  this.set({"AccessKey": appAccessCode});
      },
  });
  var Chasing = Parse.Object.extend("Chasing", {
	  defaults: {
		AccessKey: appAccessCode,
		Employee: "",
		Customer: "",
		Farm: "",
		FieldName: "",
		TipLocation: "",
		StrawType: "",
		NofBales: "",
		EndUser: "",
		Comments: "",
		createdAt: Date.now(),
		invoiced: false,
	  },
	  	sort_key: 'id',
		comparator: function(a) {
			return a.get(this.sort_key);
		},
		sortByField: function(fieldName) {
			this.sort_key = fieldName;
			this.sort();
		},
      initialize: function() {
		  // Ensure that each baling job created has `content`.
		  if (!this.get("content")) {
			this.set({"content": this.defaults.content});
		  }
		  this.set({"AccessKey": appAccessCode});
      },
  });
  
  // This is the transient application state, not persisted on Parse
  var AppState = Parse.Object.extend("AppState", {
    defaults: {
      filter: "all"
    }
  });
  

  
  // The main view that lets a user manage their todo items
  var ManageTodosView = Parse.View.extend({
    // Delegated events for creating new items, and clearing completed ones.
    events: {
      "click .log-out": "logOut",
	  "click .change-email": "changeEmail",
	  "click .download": "downloadData",
	  "click .add": "addJob",
	  "click .delete": "deleteSelected",
	  "click .invoiced": "invoiceSelected",
	  "click .TInvoiced": "toggleInvoiced",
	  "click ul#filters a": "selectFilter",
	  "click #select-all": "toggleAllSelected",
	  "click #select-allL": "toggleAllSelectedL",
	  "click #select-allD": "toggleAllSelectedD",
	  "click #select-allC": "toggleAllSelectedC",
	  "click td" : "edit",
	  "blur input.rowInput" : "finishEditing",
	  "keypress input.rowInput" : "keypressInput",
    },
    el: ".content",

    // At initialization we bind to the relevant events
    // when items are added or changed. Kick things off by
    // loading any preexisting todos that might be saved to Parse.
    initialize: function() {
      _.bindAll(this, 'render');

      // Main management template
      this.$el.html(_.template($("#manage-data-template").html()));
	        
	  state.on("change", this.filter, this);
	  this.filter();
    },

	
    // Logs out the user and shows the login view.
    logOut: function(e) {
	  //Back to the login screen....	
	  //localStorage.clear();
	  store("AccessCode", null);
      new LogInView();
      this.undelegateEvents();
      delete this;
    },
	// Opens the change email view.
    changeEmail: function(e) {
	  //On to the change email screen....	
      new emailChangeView();
	  	  document.getElementById("user-info").innerHTML ="Emails will be sent to: " +emailAddress;			  
      this.undelegateEvents();
      delete this;
    },
    downloadData: function(e) {
		//Get table
		var table = document.getElementById("mainTable");

		//Get number of rows/columns
		var rowLength = table.rows.length;
		
		//Declare string to fill with table data
		var tableString = "";
		
			
		//Get row data
		for (var j = 0; j < rowLength; j++) {
			var colLength = table.rows[j].cells.length;
			for (var k = 1; k < colLength; k++) {
				if (k < table.rows[j].cells.length)
				{
					tableString += table.rows[j].cells[k].innerHTML.split(",").join("") + ",";
				}
			}
			if (table.rows[j].cells[0].className == "table-headerH1")
			{
				if (j > 0)
				{
					tableString += "\r\n";
				}
				tableString += table.rows[j].cells[0].innerHTML.split(",").join("") + ",";
			}
			tableString += "\r\n";
		}
		//save file 
		var fileName = "List_"+state.get("filter");
		//Initialize file format you want csv or xls
		var uri = 'data:text/csv;charset=utf-8,' + escape(tableString);
		
		var ua = window.navigator.userAgent;
		var msie = ua.indexOf("MSIE ");
		if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) // If Internet Explorer, return true
		{
			var IEwindow = window.open();
			IEwindow.document.write(tableString);
			IEwindow.document.close();
			IEwindow.document.execCommand("SaveAs", true, fileName + ".csv");
			IEwindow.close();
		}
		else {
			//this trick will generate a temp <a /> tag
			var link = document.createElement("a");    
			link.href = uri;
			//set the visibility hidden so it will not effect on your web-layout
			link.style = "visibility:hidden";
			link.download = fileName + ".csv";
			//this part will append the anchor tag and remove it after automatic click
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}		
    },
	
	// Filters the list based on which type of filter is selected
    selectFilter: function(e) {
      var el = $(e.target);
      var filterValue = el.attr("id");
      state.set({filter: filterValue});
      Parse.history.navigate(filterValue);
    },
	
	toggleInvoiced: function(e) {
       showInvoiced = !showInvoiced;
	   console.log("showInvoiced: "+showInvoiced);
		var invButton = document.getElementById("InvoiceButton");
		var invButton1 = document.getElementById("InvoiceMarker");
		if (showInvoiced)
		{
			invButton.textContent = "Hide invoiced";
			invButton1.textContent = "Mark Selected as non Invoiced";
		}
		else
		{
			invButton.textContent = "Show invoiced";
			invButton1.textContent = "Mark Selected as Invoiced";
		}
		
	   this.render();
    },

    filter: function() {
      var filterValue = state.get("filter");
      this.$("ul#filters a").removeClass("selected");
      this.$("ul#filters a#" + filterValue).addClass("selected");
      //do filtering????
	  this.render();
    },
	
    // Re-rendering the App just means refreshing the statistics
    render: function() {
		  // get the set of all records as a Parse collection
		Baling.instances = (new Parse.Query(Baling)).collection();
		Delivery.instances = (new Parse.Query(Delivery)).collection();
		Loading.instances = (new Parse.Query(Loading)).collection();
		Chasing.instances = (new Parse.Query(Chasing)).collection();
		
		
	  switch (state.get("filter"))
	  {
		  // load data from Parse class
		  default:
			  Baling.instances.fetch({
				  success: function (coll) {
					
					Baling.instances = _(Baling.instances.sortBy('createdAt').reverse());	
					//Baling.instances = _(Baling.instances.sortBy(function(m) { return -m.createdAt}));
					  
					var tableBodyEl = document.querySelector(".section");
					tableBodyEl.innerHTML = "";	
					
					var row = tableBodyEl.insertRow(-1);
						var cell = row.insertCell(-1);
							if (showInvoiced)
							{
								cell.textContent = "Baling (invoiced)";
							}
							else
							{
								cell.textContent = "Baling (non invoiced)";
							}
							cell.colSpan = "20";  
							cell.className = "table-headerH1";
					
					var row = tableBodyEl.insertRow(-1);
							var cell1 = row.insertCell(-1);
							var element1 = document.createElement("input");
							element1.type = "checkbox";
							element1.id = "select-all";
							cell1.appendChild(element1);
							var element2 = document.createElement("label");
							element2.htmlFor = "select-all";
							var element3 = document.createElement("span");
							element2.appendChild(element3);
							cell1.appendChild(element2);
							cell1.className = "table-header";
							
							var cell = row.insertCell(-1);
							cell.textContent = "Employee";  
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "Customer";
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "Farm/Location";  
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "Straw Type";
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "Field Name";
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "Nº of Bales";  
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "Baler Nº";
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "Baler Start Nº";
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "Baler End Nº";
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "Size";  
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "End User";
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "Comments";
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "Date";
							cell.className = "table-header";
					
					var i = 0;
					Baling.instances.forEach( function (bkObj) {
						if (bkObj.get("AccessKey") == appAccessCode && ((bkObj.get("invoiced") == showInvoiced)
						 || (bkObj.get("invoiced") != true && showInvoiced == false)))
						{
							var objId = bkObj.id;
							var row = tableBodyEl.insertRow(-1);
							
							var cell1 = row.insertCell(-1);
							var element1 = document.createElement("input");
							element1.type = "checkbox";
							element1.id = "selectThis"+i;
							cell1.appendChild(element1);
							var element2 = document.createElement("label");
							element2.htmlFor = "selectThis"+i;
							var element3 = document.createElement("span");
							element2.appendChild(element3);
							cell1.appendChild(element2);
							
							var cell2 = row.insertCell(-1);
							cell2.textContent = bkObj.get("Employee"); 	
							cell2.value = objId;
							cell2.className = "Employee";
							
							var cell3 = row.insertCell(-1);
							cell3.textContent = bkObj.get("Customer"); 	
							cell3.value = objId;
							cell3.className = "Customer";
							
							var cell4 = row.insertCell(-1);
							cell4.textContent = bkObj.get("FarmLocation"); 	
							cell4.value = objId;
							cell4.className = "FarmLocation";

							var cell5 = row.insertCell(-1);
							cell5.textContent = bkObj.get("StrawType"); 	
							cell5.value = objId;
							cell5.className = "StrawType";
							
							var cell601 = row.insertCell(-1);
							cell601.textContent = bkObj.get("FieldName"); 	
							cell601.value = objId;
							cell601.className = "FieldName";
							
							var cell6 = row.insertCell(-1);
							cell6.textContent = bkObj.get("NofBales"); 	
							cell6.value = objId;
							cell6.className = "NofBales";
							
							var cell7 = row.insertCell(-1);
							cell7.textContent = bkObj.get("BalerN"); 	
							cell7.value = objId;
							cell7.className = "BalerN";
							
							var cell701 = row.insertCell(-1);
							cell701.textContent = bkObj.get("BalerStartN"); 	
							cell701.value = objId;
							cell701.className = "BalerStartN";
							
							var cell702 = row.insertCell(-1);
							cell702.textContent = bkObj.get("BalerEndN"); 	
							cell702.value = objId;
							cell702.className = "BalerEndN";

							var cell8 = row.insertCell(-1);
							cell8.textContent = bkObj.get("Size"); 	
							cell8.value = objId;
							cell8.className = "Size";
							
							var cell801 = row.insertCell(-1);
							cell801.textContent = bkObj.get("EndUser"); 	
							cell801.value = objId;
							cell801.className = "EndUser";
							
							var cell9 = row.insertCell(-1);
							cell9.textContent = bkObj.get("Comments"); 	
							cell9.value = objId;
							cell9.className = "Comments";
							
							var date = bkObj.createdAt.toUTCString();
							var cell10 = row.insertCell(-1);
							cell10.textContent = date; 	
							cell10.value = objId;
							cell10.className = "createdAt";
							
							i++;
						}
					});
				  },
				  error: function (coll, error) 
				  {
					console.log("Error getting baling jobs: " + error);
				  }
			  });
		  break;
		  case "loading":
			  Loading.instances.fetch({
				  success: function (coll) {
					  
					Loading.instances = _(Loading.instances.sortBy('createdAt').reverse());					

					var tableBodyEl = document.querySelector(".section");
					tableBodyEl.innerHTML = "";	
					
					var row = tableBodyEl.insertRow(-1);
						var cell = row.insertCell(-1);
							if (showInvoiced)
							{
								cell.textContent = "Loading (invoiced)";
							}
							else
							{
								cell.textContent = "Loading (non invoiced)";
							}  
							cell.colSpan = "20";  
							cell.className = "table-headerH1";
							
					var row = tableBodyEl.insertRow(-1);
							var cell1 = row.insertCell(-1);
							var element1 = document.createElement("input");
							element1.type = "checkbox";
							element1.id = "select-all";
							cell1.appendChild(element1);
							var element2 = document.createElement("label");
							element2.htmlFor = "select-all";
							var element3 = document.createElement("span");
							element2.appendChild(element3);
							cell1.appendChild(element2);
							cell1.className = "table-header";
							
							var cell = row.insertCell(-1);
							cell.textContent = "Employee";  
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "Customer";
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "Farm";  
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "Stack Location";
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "Straw Type";  
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "Haulier";
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "Registration Nº";  
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "End User";
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "Nº of bales";
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "Size";  
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "Comments";
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "Date";
							cell.className = "table-header";					
					var i = 0;
					Loading.instances.forEach( function (bkObj) {
						if (bkObj.get("AccessKey") == appAccessCode && ((bkObj.get("invoiced") == showInvoiced)
						 || (bkObj.get("invoiced") != true && showInvoiced == false)))
						{
							var objId = bkObj.id;
							var row = tableBodyEl.insertRow(-1);
							
							var cell1 = row.insertCell(-1);
							var element1 = document.createElement("input");
							element1.type = "checkbox";
							element1.id = "selectThis"+i;
							cell1.appendChild(element1);
							var element2 = document.createElement("label");
							element2.htmlFor = "selectThis"+i;
							var element3 = document.createElement("span");
							element2.appendChild(element3);
							cell1.appendChild(element2);
							
							var cell2 = row.insertCell(-1);
							cell2.textContent = bkObj.get("Employee"); 	
							cell2.value = objId;
							cell2.className = "Employee";
							
							var cell301 = row.insertCell(-1);
							cell301.textContent = bkObj.get("Customer"); 	
							cell301.value = objId;
							cell301.className = "Customer";
							
							var cell401 = row.insertCell(-1);
							cell401.textContent = bkObj.get("Farm"); 	
							cell401.value = objId;
							cell401.className = "Farm";
							
							var cell3 = row.insertCell(-1);
							cell3.textContent = bkObj.get("StackLocation"); 	
							cell3.value = objId;
							cell3.className = "StackLocation";
							
							var cell4 = row.insertCell(-1);
							cell4.textContent = bkObj.get("StrawType"); 	
							cell4.value = objId;
							cell4.className = "StrawType";

							var cell5 = row.insertCell(-1);
							cell5.textContent = bkObj.get("Haulier"); 	
							cell5.value = objId;
							cell5.className = "Haulier";
							
							var cell6 = row.insertCell(-1);
							cell6.textContent = bkObj.get("RegistrationN"); 	
							cell6.value = objId;
							cell6.className = "RegistrationN";
							
							var cell77 = row.insertCell(-1);
							cell77.textContent = bkObj.get("EndUser"); 	
							cell77.value = objId;
							cell77.className = "EndUser";
							
							var cell7 = row.insertCell(-1);
							cell7.textContent = bkObj.get("NofBales"); 	
							cell7.value = objId;
							cell7.className = "NofBales";
							
							var cell8 = row.insertCell(-1);
							cell8.textContent = bkObj.get("Size"); 	
							cell8.value = objId;
							cell8.className = "Size";
							
							var cell9 = row.insertCell(-1);
							cell9.textContent = bkObj.get("Comments"); 	
							cell9.value = objId;
							cell9.className = "Comments";
							
							var date = bkObj.createdAt.toUTCString();
							var cell10 = row.insertCell(-1);
							cell10.textContent = date; 	
							cell10.value = objId;
							cell10.className = "createdAt";
							
							i++;
						}
					});
				  },
				  error: function (coll, error) 
				  {
					console.log("Error getting loading jobs: " + error);
				  }
			  });
		  break;
		  case "deliveries":
			  Delivery.instances.fetch({
				  success: function (coll) {
					  				
					Delivery.instances = _(Delivery.instances.sortBy('createdAt').reverse());					

					var tableBodyEl = document.querySelector(".section");
					tableBodyEl.innerHTML = "";	
						
						var row = tableBodyEl.insertRow(-1);
						var cell = row.insertCell(-1);
							if (showInvoiced)
							{
								cell.textContent = "Deliveries (invoiced)";
							}
							else
							{
								cell.textContent = "Deliveries (non invoiced)";
							} 
							cell.colSpan = "20";  
							cell.className = "table-headerH1";					
						
						var row = tableBodyEl.insertRow(-1);
							var cell1 = row.insertCell(-1);
							var element1 = document.createElement("input");
							element1.type = "checkbox";
							element1.id = "select-all";
							cell1.appendChild(element1);
							var element2 = document.createElement("label");
							element2.htmlFor = "select-all";
							var element3 = document.createElement("span");
							element2.appendChild(element3);
							cell1.appendChild(element2);
							cell1.className = "table-header";
							
							var cell = row.insertCell(-1);
							cell.textContent = "Employee";  
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "Customer";
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "Pick Up Location";  
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "Delivery Location";  
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "Nº of Bales";  
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "Size";
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "Straw Type";  
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "Comments";
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "Date";
							cell.className = "table-header";
					var i = 0;
					Delivery.instances.forEach( function (bkObj) {
						if (bkObj.get("AccessKey") == appAccessCode && ((bkObj.get("invoiced") == showInvoiced)
						 || (bkObj.get("invoiced") != true && showInvoiced == false)))
						{
							var objId = bkObj.id;
							var row = tableBodyEl.insertRow(-1);
							
							var cell1 = row.insertCell(-1);
							var element1 = document.createElement("input");
							element1.type = "checkbox";
							element1.id = "selectThis"+i;
							cell1.appendChild(element1);
							var element2 = document.createElement("label");
							element2.htmlFor = "selectThis"+i;
							var element3 = document.createElement("span");
							element2.appendChild(element3);
							cell1.appendChild(element2);
							
							var cell2 = row.insertCell(-1);
							cell2.textContent = bkObj.get("Employee"); 	
							cell2.value = objId;
							cell2.className = "Employee";
							
							var cell3 = row.insertCell(-1);
							cell3.textContent = bkObj.get("Customer"); 	
							cell3.value = objId;
							cell3.className = "Customer";
							
							var cell4 = row.insertCell(-1);
							cell4.textContent = bkObj.get("PickUpLocation"); 	
							cell4.value = objId;
							cell4.className = "PickUpLocation";
							
							var cell8 = row.insertCell(-1);
							cell8.textContent = bkObj.get("DeliveryLocation"); 	
							cell8.value = objId;
							cell8.className = "DeliveryLocation";

							var cell5 = row.insertCell(-1);
							cell5.textContent = bkObj.get("NofBales"); 	
							cell5.value = objId;
							cell5.className = "NofBales";
							
							var cell7 = row.insertCell(-1);
							cell7.textContent = bkObj.get("Size"); 	
							cell7.value = objId;
							cell7.className = "Size";
							
							var cell9 = row.insertCell(-1);
							cell9.textContent = bkObj.get("StrawType"); 	
							cell9.value = objId;
							cell9.className = "StrawType";
							
							var cell10 = row.insertCell(-1);
							cell10.textContent = bkObj.get("Comments"); 	
							cell10.value = objId;
							cell10.className = "Comments";
							
							var date = bkObj.createdAt.toUTCString();
							var cell11 = row.insertCell(-1);
							cell11.textContent = date; 	
							cell11.value = objId;
							cell11.className = "createdAt";
							
							i++;
						}
					});
				  },
				  error: function (coll, error) 
				  {
					console.log("Error getting loading jobs: " + error);
				  }
			  });
		  break;
		  case "chasing":
			  Chasing.instances.fetch({
				  success: function (coll) {
					  
					Chasing.instances = _(Chasing.instances.sortBy('createdAt').reverse());					

					var tableBodyEl = document.querySelector(".section");
					tableBodyEl.innerHTML = "";
					
						var row = tableBodyEl.insertRow(-1);
						var cell = row.insertCell(-1);
							if (showInvoiced)
							{
								cell.textContent = "Chasing (invoiced)";
							}
							else
							{
								cell.textContent = "Chasing (non invoiced)";
							}   
							cell.colSpan = "20"; 
							cell.className = "table-headerH1";
							
						var row = tableBodyEl.insertRow(-1);
							var cell1 = row.insertCell(-1);
							var element1 = document.createElement("input");
							element1.type = "checkbox";
							element1.id = "select-all";
							cell1.appendChild(element1);
							var element2 = document.createElement("label");
							element2.htmlFor = "select-all";
							var element3 = document.createElement("span");
							element2.appendChild(element3);
							cell1.appendChild(element2);
							cell1.className = "table-header";
							
							var cell = row.insertCell(-1);
							cell.textContent = "Employee";  
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "Customer";
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "Farm";
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "Field Name";
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "Tip Location";  
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "Straw Type";  
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "Nº of Bales";
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "End User";
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "Comments";
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "Date";
							cell.className = "table-header";
					var i = 0;
					Chasing.instances.forEach( function (bkObj) {
						if (bkObj.get("AccessKey") == appAccessCode && ((bkObj.get("invoiced") == showInvoiced)
						 || (bkObj.get("invoiced") != true && showInvoiced == false)))
						{
							var objId = bkObj.id;
							var row = tableBodyEl.insertRow(-1);
							
							var cell1 = row.insertCell(-1);
							var element1 = document.createElement("input");
							element1.type = "checkbox";
							element1.id = "selectThis"+i;
							cell1.appendChild(element1);
							var element2 = document.createElement("label");
							element2.htmlFor = "selectThis"+i;
							var element3 = document.createElement("span");
							element2.appendChild(element3);
							cell1.appendChild(element2);
							
							var cell2 = row.insertCell(-1);
							cell2.textContent = bkObj.get("Employee"); 	
							cell2.value = objId;
							cell2.className = "Employee";
							
							var cell4 = row.insertCell(-1);
							cell4.textContent = bkObj.get("Customer"); 	
							cell4.value = objId;
							cell4.className = "Customer";
							
							var cell40 = row.insertCell(-1);
							cell40.textContent = bkObj.get("Farm"); 	
							cell40.value = objId;
							cell40.className = "Farm";
							
							var cell44 = row.insertCell(-1);
							cell44.textContent = bkObj.get("FieldName"); 	
							cell44.value = objId;
							cell44.className = "FieldName";

							var cell5 = row.insertCell(-1);
							cell5.textContent = bkObj.get("TipLocation"); 	
							cell5.value = objId;
							cell5.className = "TipLocation";
							
							var cell6 = row.insertCell(-1);
							cell6.textContent = bkObj.get("StrawType"); 	
							cell6.value = objId;
							cell6.className = "StrawType";
							
							var cell7 = row.insertCell(-1);
							cell7.textContent = bkObj.get("NofBales"); 	
							cell7.value = objId;
							cell7.className = "NofBales";

							var cell79 = row.insertCell(-1);
							cell79.textContent = bkObj.get("EndUser"); 	
							cell79.value = objId;
							cell79.className = "EndUser";
							
							var cell10 = row.insertCell(-1);
							cell10.textContent = bkObj.get("Comments"); 	
							cell10.value = objId;
							cell10.className = "Comments";
							
							var date = bkObj.createdAt.toUTCString();
							var cell11 = row.insertCell(-1);
							cell11.textContent = date; 	
							cell11.value = objId;
							cell11.className = "createdAt";
							
							i++;
						}
					});
				  },
				  error: function (coll, error) 
				  {
					console.log("Error getting loading jobs: " + error);
				  }
			  });
		  break;
		  case "all":
				var tableBodyEl = document.querySelector(".section");
				tableBodyEl.innerHTML = "";	
				
			  Baling.instances.fetch({
				  success: function (coll) {
					  
					Baling.instances = _(Baling.instances.sortBy('createdAt').reverse());					
					
					var row = tableBodyEl.insertRow(-1);
						var cell = row.insertCell(-1);
							if (showInvoiced)
							{
								cell.textContent = "Baling (invoiced)";
							}
							else
							{
								cell.textContent = "Baling (non invoiced)";
							} 
							cell.colSpan = "20";
							cell.className = "table-headerH1";

					var row = tableBodyEl.insertRow(-1);
							var cell1 = row.insertCell(-1);
							var element1 = document.createElement("input");
							element1.type = "checkbox";
							element1.id = "select-all";
							cell1.appendChild(element1);
							var element2 = document.createElement("label");
							element2.htmlFor = "select-all";
							var element3 = document.createElement("span");
							element2.appendChild(element3);
							cell1.appendChild(element2);
							cell1.className = "table-header";
							
							var cell = row.insertCell(-1);
							cell.textContent = "Employee";  
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "Customer";
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "Farm/Location";  
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "Straw Type";
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "Field Name";
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "Nº of Bales";  
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "Baler Nº";
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "Baler Start Nº";
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "Baler End Nº";
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "Size";  
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "End User";
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "Comments";
							cell.className = "table-header";
							cell = row.insertCell(-1);
							cell.textContent = "Date";
							cell.className = "table-header";
					
					var i = 0;
					Baling.instances.forEach( function (bkObj) {
						if (bkObj.get("AccessKey") == appAccessCode && ((bkObj.get("invoiced") == showInvoiced)
						 || (bkObj.get("invoiced") != true && showInvoiced == false)))
						{
							var objId = bkObj.id;
							var row = tableBodyEl.insertRow(-1);
							
							var cell1 = row.insertCell(-1);
							var element1 = document.createElement("input");
							element1.type = "checkbox";
							element1.id = "selectThis"+i;
							cell1.appendChild(element1);
							var element2 = document.createElement("label");
							element2.htmlFor = "selectThis"+i;
							var element3 = document.createElement("span");
							element2.appendChild(element3);
							cell1.appendChild(element2);
							
							var cell2 = row.insertCell(-1);
							cell2.textContent = bkObj.get("Employee"); 	
							cell2.value = objId;
							cell2.className = "Employee";
							
							var cell3 = row.insertCell(-1);
							cell3.textContent = bkObj.get("Customer"); 	
							cell3.value = objId;
							cell3.className = "Customer";
							
							var cell4 = row.insertCell(-1);
							cell4.textContent = bkObj.get("FarmLocation"); 	
							cell4.value = objId;
							cell4.className = "FarmLocation";

							var cell5 = row.insertCell(-1);
							cell5.textContent = bkObj.get("StrawType"); 	
							cell5.value = objId;
							cell5.className = "StrawType";
							
							var cell601 = row.insertCell(-1);
							cell601.textContent = bkObj.get("FieldName"); 	
							cell601.value = objId;
							cell601.className = "FieldName";
							
							var cell6 = row.insertCell(-1);
							cell6.textContent = bkObj.get("NofBales"); 	
							cell6.value = objId;
							cell6.className = "NofBales";
							
							var cell7 = row.insertCell(-1);
							cell7.textContent = bkObj.get("BalerN"); 	
							cell7.value = objId;
							cell7.className = "BalerN";
							
							var cell701 = row.insertCell(-1);
							cell701.textContent = bkObj.get("BalerStartN"); 	
							cell701.value = objId;
							cell701.className = "BalerStartN";
							
							var cell702 = row.insertCell(-1);
							cell702.textContent = bkObj.get("BalerEndN"); 	
							cell702.value = objId;
							cell702.className = "BalerEndN";

							var cell8 = row.insertCell(-1);
							cell8.textContent = bkObj.get("Size"); 	
							cell8.value = objId;
							cell8.className = "Size";
							
							var cell801 = row.insertCell(-1);
							cell801.textContent = bkObj.get("EndUser"); 	
							cell801.value = objId;
							cell801.className = "EndUser";
							
							var cell9 = row.insertCell(-1);
							cell9.textContent = bkObj.get("Comments"); 	
							cell9.value = objId;
							cell9.className = "Comments";
							
							var date = bkObj.createdAt.toUTCString();
							var cell10 = row.insertCell(-1);
							cell10.textContent = date; 	
							cell10.value = objId;
							cell10.className = "createdAt";
							
							i++;
						}
					});
					
					Loading.instances.fetch({
					  success: function (coll) {
						  
						Loading.instances = _(Loading.instances.sortBy('createdAt').reverse());					
						
						var row = tableBodyEl.insertRow(-1);
							var cell = row.insertCell(-1);
								if (showInvoiced)
								{
									cell.textContent = "Loading (invoiced)";
								}
								else
								{
									cell.textContent = "Loading (non invoiced)";
								} 
								cell.colSpan = "20";  
								cell.className = "table-headerH1";
								
						var row = tableBodyEl.insertRow(-1);
								var cell1 = row.insertCell(-1);
								var element1 = document.createElement("input");
								element1.type = "checkbox";
								element1.id = "select-allL";
								cell1.appendChild(element1);
								var element2 = document.createElement("label");
								element2.htmlFor = "select-allL";
								var element3 = document.createElement("span");
								element2.appendChild(element3);
								cell1.appendChild(element2);
								cell1.className = "table-header";
								
								var cell = row.insertCell(-1);
								cell.textContent = "Employee";  
								cell.className = "table-header";
								cell = row.insertCell(-1);
								cell.textContent = "Customer";
								cell.className = "table-header";
								cell = row.insertCell(-1);
								cell.textContent = "Farm";  
								cell.className = "table-header";
								cell = row.insertCell(-1);
								cell.textContent = "Stack Location";
								cell.className = "table-header";
								cell = row.insertCell(-1);
								cell.textContent = "Straw Type";  
								cell.className = "table-header";
								cell = row.insertCell(-1);
								cell.textContent = "Haulier";
								cell.className = "table-header";
								cell = row.insertCell(-1);
								cell.textContent = "Registration Nº";  
								cell.className = "table-header";
								cell = row.insertCell(-1);
								cell.textContent = "End User";
								cell.className = "table-header";
								cell = row.insertCell(-1);
								cell.textContent = "Nº of bales";
								cell.className = "table-header";
								cell = row.insertCell(-1);
								cell.textContent = "Size";  
								cell.className = "table-header";
								cell = row.insertCell(-1);
								cell.textContent = "Comments";
								cell.className = "table-header";
								cell = row.insertCell(-1);
								cell.textContent = "Date";
								cell.className = "table-header";					
						var i = 0;
						Loading.instances.forEach( function (bkObj) {
							if (bkObj.get("AccessKey") == appAccessCode && ((bkObj.get("invoiced") == showInvoiced)
							 || (bkObj.get("invoiced") != true && showInvoiced == false)))
							{
								var objId = bkObj.id;
								var row = tableBodyEl.insertRow(-1);
								
								var cell1 = row.insertCell(-1);
								var element1 = document.createElement("input");
								element1.type = "checkbox";
								element1.id = "selectThisL"+i;
								cell1.appendChild(element1);
								var element2 = document.createElement("label");
								element2.htmlFor = "selectThisL"+i;
								var element3 = document.createElement("span");
								element2.appendChild(element3);
								cell1.appendChild(element2);
								
								var cell2 = row.insertCell(-1);
								cell2.textContent = bkObj.get("Employee"); 	
								cell2.value = objId;
								cell2.className = "Employee";
								
								var cell301 = row.insertCell(-1);
								cell301.textContent = bkObj.get("Customer"); 	
								cell301.value = objId;
								cell301.className = "Customer";
								
								var cell401 = row.insertCell(-1);
								cell401.textContent = bkObj.get("Farm"); 	
								cell401.value = objId;
								cell401.className = "Farm";
								
								var cell3 = row.insertCell(-1);
								cell3.textContent = bkObj.get("StackLocation"); 	
								cell3.value = objId;
								cell3.className = "StackLocation";
								
								var cell4 = row.insertCell(-1);
								cell4.textContent = bkObj.get("StrawType"); 	
								cell4.value = objId;
								cell4.className = "StrawType";

								var cell5 = row.insertCell(-1);
								cell5.textContent = bkObj.get("Haulier"); 	
								cell5.value = objId;
								cell5.className = "Haulier";
								
								var cell6 = row.insertCell(-1);
								cell6.textContent = bkObj.get("RegistrationN"); 	
								cell6.value = objId;
								cell6.className = "RegistrationN";
								
								var cell77 = row.insertCell(-1);
								cell77.textContent = bkObj.get("EndUser"); 	
								cell77.value = objId;
								cell77.className = "EndUser";
								
								var cell7 = row.insertCell(-1);
								cell7.textContent = bkObj.get("NofBales"); 	
								cell7.value = objId;
								cell7.className = "NofBales";
								
								var cell8 = row.insertCell(-1);
								cell8.textContent = bkObj.get("Size"); 	
								cell8.value = objId;
								cell8.className = "Size";
								
								var cell9 = row.insertCell(-1);
								cell9.textContent = bkObj.get("Comments"); 	
								cell9.value = objId;
								cell9.className = "Comments";
								
								var date = bkObj.createdAt.toUTCString();
								var cell10 = row.insertCell(-1);
								cell10.textContent = date; 	
								cell10.value = objId;
								cell10.className = "createdAt";
								
								i++;
							}
						});
						
						Delivery.instances.fetch({
						  success: function (coll) {
							  
							Delivery.instances = _(Delivery.instances.sortBy('createdAt').reverse());					
								
								var row = tableBodyEl.insertRow(-1);
								var cell = row.insertCell(-1);
									if (showInvoiced)
									{
										cell.textContent = "Deliveries (invoiced)";
									}
									else
									{
										cell.textContent = "Deliveries (non invoiced)";
									} 
									cell.colSpan = "20";  
									cell.className = "table-headerH1";					
								
								var row = tableBodyEl.insertRow(-1);
									var cell1 = row.insertCell(-1);
									var element1 = document.createElement("input");
									element1.type = "checkbox";
									element1.id = "select-allD";
									cell1.appendChild(element1);
									var element2 = document.createElement("label");
									element2.htmlFor = "select-allD";
									var element3 = document.createElement("span");
									element2.appendChild(element3);
									cell1.appendChild(element2);
									cell1.className = "table-header";
									
									var cell = row.insertCell(-1);
									cell.textContent = "Employee";  
									cell.className = "table-header";
									cell = row.insertCell(-1);
									cell.textContent = "Customer";
									cell.className = "table-header";
									cell = row.insertCell(-1);
									cell.textContent = "Pick Up Location";  
									cell.className = "table-header";
									cell = row.insertCell(-1);
									cell.textContent = "Delivery Location";  
									cell.className = "table-header";
									cell = row.insertCell(-1);
									cell.textContent = "Nº of Bales";  
									cell.className = "table-header";
									cell = row.insertCell(-1);
									cell.textContent = "Size";
									cell.className = "table-header";
									cell = row.insertCell(-1);
									cell.textContent = "Straw Type";  
									cell.className = "table-header";
									cell = row.insertCell(-1);
									cell.textContent = "Comments";
									cell.className = "table-header";
									cell = row.insertCell(-1);
									cell.textContent = "Date";
									cell.className = "table-header";
							var i = 0;
							Delivery.instances.forEach( function (bkObj) {
								if (bkObj.get("AccessKey") == appAccessCode && ((bkObj.get("invoiced") == showInvoiced)
								 || (bkObj.get("invoiced") != true && showInvoiced == false)))
								{
									var objId = bkObj.id;
									var row = tableBodyEl.insertRow(-1);
									
									var cell1 = row.insertCell(-1);
									var element1 = document.createElement("input");
									element1.type = "checkbox";
									element1.id = "selectThisD"+i;
									cell1.appendChild(element1);
									var element2 = document.createElement("label");
									element2.htmlFor = "selectThisD"+i;
									var element3 = document.createElement("span");
									element2.appendChild(element3);
									cell1.appendChild(element2);
									
									var cell2 = row.insertCell(-1);
									cell2.textContent = bkObj.get("Employee"); 	
									cell2.value = objId;
									cell2.className = "Employee";
									
									var cell3 = row.insertCell(-1);
									cell3.textContent = bkObj.get("Customer"); 	
									cell3.value = objId;
									cell3.className = "Customer";
									
									var cell4 = row.insertCell(-1);
									cell4.textContent = bkObj.get("PickUpLocation"); 	
									cell4.value = objId;
									cell4.className = "PickUpLocation";
									
									var cell8 = row.insertCell(-1);
									cell8.textContent = bkObj.get("DeliveryLocation"); 	
									cell8.value = objId;
									cell8.className = "DeliveryLocation";

									var cell5 = row.insertCell(-1);
									cell5.textContent = bkObj.get("NofBales"); 	
									cell5.value = objId;
									cell5.className = "NofBales";
									
									var cell7 = row.insertCell(-1);
									cell7.textContent = bkObj.get("Size"); 	
									cell7.value = objId;
									cell7.className = "Size";
									
									var cell9 = row.insertCell(-1);
									cell9.textContent = bkObj.get("StrawType"); 	
									cell9.value = objId;
									cell9.className = "StrawType";
									
									var cell10 = row.insertCell(-1);
									cell10.textContent = bkObj.get("Comments"); 	
									cell10.value = objId;
									cell10.className = "Comments";
									
									var date = bkObj.createdAt.toUTCString();
									var cell11 = row.insertCell(-1);
									cell11.textContent = date; 	
									cell11.value = objId;
									cell11.className = "createdAt";
									
									i++;
								}
							});
							
							Chasing.instances.fetch({
							  success: function (coll) {
								  
								Chasing.instances = _(Chasing.instances.sortBy('createdAt').reverse());					
								
									var row = tableBodyEl.insertRow(-1);
									var cell = row.insertCell(-1);
										if (showInvoiced)
										{
											cell.textContent = "Chasing (invoiced)";
										}
										else
										{
											cell.textContent = "Chasing (non invoiced)";
										} 
										cell.colSpan = "20"; 
										cell.className = "table-headerH1";
										
									var row = tableBodyEl.insertRow(-1);
										var cell1 = row.insertCell(-1);
										var element1 = document.createElement("input");
										element1.type = "checkbox";
										element1.id = "select-allC";
										cell1.appendChild(element1);
										var element2 = document.createElement("label");
										element2.htmlFor = "select-allC";
										var element3 = document.createElement("span");
										element2.appendChild(element3);
										cell1.appendChild(element2);
										cell1.className = "table-header";
										
										var cell = row.insertCell(-1);
										cell.textContent = "Employee";  
										cell.className = "table-header";
										cell = row.insertCell(-1);
										cell.textContent = "Customer";
										cell.className = "table-header";
										cell = row.insertCell(-1);
										cell.textContent = "Farm";
										cell.className = "table-header";
										cell = row.insertCell(-1);
										cell.textContent = "Field Name";
										cell.className = "table-header";
										cell = row.insertCell(-1);
										cell.textContent = "Tip Location";  
										cell.className = "table-header";
										cell = row.insertCell(-1);
										cell.textContent = "Straw Type";  
										cell.className = "table-header";
										cell = row.insertCell(-1);
										cell.textContent = "Nº of Bales";
										cell.className = "table-header";
										cell = row.insertCell(-1);
										cell.textContent = "End User";
										cell.className = "table-header";
										cell = row.insertCell(-1);
										cell.textContent = "Comments";
										cell.className = "table-header";
										cell = row.insertCell(-1);
										cell.textContent = "Date";
										cell.className = "table-header";
								var i = 0;
								Chasing.instances.forEach( function (bkObj) {
									if (bkObj.get("AccessKey") == appAccessCode && ((bkObj.get("invoiced") == showInvoiced)
									 || (bkObj.get("invoiced") != true && showInvoiced == false)))
									{
										var objId = bkObj.id;
										var row = tableBodyEl.insertRow(-1);
										
										var cell1 = row.insertCell(-1);
										var element1 = document.createElement("input");
										element1.type = "checkbox";
										element1.id = "selectThisC"+i;
										cell1.appendChild(element1);
										var element2 = document.createElement("label");
										element2.htmlFor = "selectThisC"+i;
										var element3 = document.createElement("span");
										element2.appendChild(element3);
										cell1.appendChild(element2);
										
										var cell2 = row.insertCell(-1);
										cell2.textContent = bkObj.get("Employee"); 	
										cell2.value = objId;
										cell2.className = "Employee";
										
										var cell4 = row.insertCell(-1);
										cell4.textContent = bkObj.get("Customer"); 	
										cell4.value = objId;
										cell4.className = "Customer";
										
										var cell40 = row.insertCell(-1);
										cell40.textContent = bkObj.get("Farm"); 	
										cell40.value = objId;
										cell40.className = "Farm";
										
										var cell44 = row.insertCell(-1);
										cell44.textContent = bkObj.get("FieldName"); 	
										cell44.value = objId;
										cell44.className = "FieldName";

										var cell5 = row.insertCell(-1);
										cell5.textContent = bkObj.get("TipLocation"); 	
										cell5.value = objId;
										cell5.className = "TipLocation";
										
										var cell6 = row.insertCell(-1);
										cell6.textContent = bkObj.get("StrawType"); 	
										cell6.value = objId;
										cell6.className = "StrawType";
										
										var cell7 = row.insertCell(-1);
										cell7.textContent = bkObj.get("NofBales"); 	
										cell7.value = objId;
										cell7.className = "NofBales";

										var cell79 = row.insertCell(-1);
										cell79.textContent = bkObj.get("EndUser"); 	
										cell79.value = objId;
										cell79.className = "EndUser";
										
										var cell10 = row.insertCell(-1);
										cell10.textContent = bkObj.get("Comments"); 	
										cell10.value = objId;
										cell10.className = "Comments";
										
										var date = bkObj.createdAt.toUTCString();
										var cell11 = row.insertCell(-1);
										cell11.textContent = date; 	
										cell11.value = objId;
										cell11.className = "createdAt";
										
										i++;
									}
								});
							  },
							  error: function (coll, error) 
							  {
								console.log("Error getting loading jobs: " + error);
							  }
						  });
							
						  },
						  error: function (coll, error) 
						  {
							console.log("Error getting loading jobs: " + error);
						  }
					  });
						
					  },
					  error: function (coll, error) 
					  {
						console.log("Error getting loading jobs: " + error);
					  }
				  });
					
				  },
				  error: function (coll, error) 
				  {
					console.log("Error getting baling jobs: " + error);
				  }
			  });
		  break;
	  }
	  
      this.delegateEvents();
    },

	addJob: function(e) {
		console.log("new item created");
		switch (state.get("filter"))
	  {
		  default:
			var newobj = new Baling();
			newobj.save(null, {
				success: function(newobj) {
					// Execute any logic that should take place after the object is saved.
					console.log('New object created with objectId: ' + newobj.id);
				},
				error: function(newobj, error) {
					// Execute any logic that should take place if the save fails.
					alert('Failed to create new object, with error code: ' + error.message);
				}
			});
		  break;
		  case "loading":
		  var newobj = new Loading();
			newobj.save(null, {
				success: function(newobj) {
					// Execute any logic that should take place after the object is saved.
					console.log('New object created with objectId: ' + newobj.id);
				},
				error: function(newobj, error) {
					// Execute any logic that should take place if the save fails.
					alert('Failed to create new object, with error code: ' + error.message);
				}
			});
		  break;
		  case "chasing":
		  var newobj = new Chasing();
			newobj.save(null, {
				success: function(newobj) {
					// Execute any logic that should take place after the object is saved.
					console.log('New object created with objectId: ' + newobj.id);
				},
				error: function(newobj, error) {
					// Execute any logic that should take place if the save fails.
					alert('Failed to create new object, with error code: ' + error.message);
				}
			});
		  break;
		  case "deliveries":
		  var newobj = new Delivery();
			newobj.save(null, {
				success: function(newobj) {
					// Execute any logic that should take place after the object is saved.
					console.log('New object created with objectId: ' + newobj.id);
				},
				error: function(newobj, error) {
					// Execute any logic that should take place if the save fails.
					alert('Failed to create new object, with error code: ' + error.message);
				}
			});
		  break;
		  case "all":
		  var newobj = new Baling();
			newobj.save(null, {
				success: function(newobj) {
					// Execute any logic that should take place after the object is saved.
					console.log('New object created with objectId: ' + newobj.id);
				},
				error: function(newobj, error) {
					// Execute any logic that should take place if the save fails.
					alert('Failed to create new object, with error code: ' + error.message);
				}
			});
			var newobj2 = new Loading();
			newobj2.save(null, {
				success: function(newobj2) {
					// Execute any logic that should take place after the object is saved.
					console.log('New object created with objectId: ' + newobj2.id);
				},
				error: function(newobj2, error) {
					// Execute any logic that should take place if the save fails.
					alert('Failed to create new object, with error code: ' + error.message);
				}
			});
		  var newobj3 = new Delivery();
			newobj3.save(null, {
				success: function(newobj3) {
					// Execute any logic that should take place after the object is saved.
					console.log('New object created with objectId: ' + newobj3.id);
				},
				error: function(newobj3, error) {
					// Execute any logic that should take place if the save fails.
					alert('Failed to create new object, with error code: ' + error.message);
				}
			});
			var newobj4 = new Chasing();
			newobj4.save(null, {
				success: function(newobj4) {
					// Execute any logic that should take place after the object is saved.
					console.log('New object created with objectId: ' + newobj4.id);
				},
				error: function(newobj4, error) {
					// Execute any logic that should take place if the save fails.
					alert('Failed to create new object, with error code: ' + error.message);
				}
			});
		  break;
	  }
		this.render();
	},
	
	deleteSelected: function(e) {
	  switch (state.get("filter"))
	  {
		  default:
			  var i = 0;
			  var arr = [];
			  Baling.instances.forEach( function (bkObj) {
				if (bkObj.get("AccessKey") == appAccessCode && ((bkObj.get("invoiced") == showInvoiced)
						 || (bkObj.get("invoiced") != true && showInvoiced == false)))
				{
				  var thisCheckbox = this.$("#selectThis"+i)[0];
				  if (thisCheckbox.checked)
				  {
					  arr.push(bkObj);
				  }
				  i++;
				}
			  });	
			  Parse.Object.destroyAll(arr).then(function(success) 
				{
				  console.log("Deleted selected objects") 
				}, function(error) {
				  console.error("Oops! Something went wrong: " + error.message + " (" + error.code + ")");
				});
		  break;
		  case "loading":
			  var i = 0;
			  Loading.instances.forEach( function (bkObj) {
				if (bkObj.get("AccessKey") == appAccessCode && ((bkObj.get("invoiced") == showInvoiced)
						 || (bkObj.get("invoiced") != true && showInvoiced == false)))
				{
				  var thisCheckbox = this.$("#selectThis"+i)[0];
				  if (thisCheckbox.checked)
				  {
					  arr.push(bkObj);
				  }
				  i++;
				}
			  });	
			  Parse.Object.destroyAll(arr).then(function(success) 
				{
				  console.log("Deleted selected objects") 
				}, function(error) {
				  console.error("Oops! Something went wrong: " + error.message + " (" + error.code + ")");
				});
		  break;
		  case "deliveries":
			  var i = 0;
			  Delivery.instances.forEach( function (bkObj) {
				if (bkObj.get("AccessKey") == appAccessCode && ((bkObj.get("invoiced") == showInvoiced)
						 || (bkObj.get("invoiced") != true && showInvoiced == false)))
				{
				  var thisCheckbox = this.$("#selectThis"+i)[0];
				  if (thisCheckbox.checked)
				  {
					  arr.push(bkObj);
				  }
				  i++;
				}
			  });	
			  Parse.Object.destroyAll(arr).then(function(success) 
				{
				  console.log("Deleted selected objects") 
				}, function(error) {
				  console.error("Oops! Something went wrong: " + error.message + " (" + error.code + ")");
				});
		  break;
		  case "chasing":
			  var i = 0;
			  Chasing.instances.forEach( function (bkObj) {
				if (bkObj.get("AccessKey") == appAccessCode && ((bkObj.get("invoiced") == showInvoiced)
						 || (bkObj.get("invoiced") != true && showInvoiced == false)))
				{
				  var thisCheckbox = this.$("#selectThis"+i)[0];
				  if (thisCheckbox.checked)
				  {
					  arr.push(bkObj);
				  }
				  i++;
				}
			  });	
			  Parse.Object.destroyAll(arr).then(function(success) 
				{
				  console.log("Deleted selected objects") 
				}, function(error) {
				  console.error("Oops! Something went wrong: " + error.message + " (" + error.code + ")");
				});
		  break;
		  case "all":
			  var i = 0;
			  var arr = [];
			  Baling.instances.forEach( function (bkObj) {
				if (bkObj.get("AccessKey") == appAccessCode && ((bkObj.get("invoiced") == showInvoiced)
						 || (bkObj.get("invoiced") != true && showInvoiced == false)))
				{
				  var thisCheckbox = this.$("#selectThis"+i)[0];
				  if (thisCheckbox.checked)
				  {
					  arr.push(bkObj);
				  }
				  i++;
				}
			  });	
			  Parse.Object.destroyAll(arr).then(function(success) 
				{
				  console.log("Deleted selected objects") 
				}, function(error) {
				  console.error("Oops! Something went wrong: " + error.message + " (" + error.code + ")");
				});
			  i = 0;
			  Loading.instances.forEach( function (bkObj) {
				if (bkObj.get("AccessKey") == appAccessCode && ((bkObj.get("invoiced") == showInvoiced)
						 || (bkObj.get("invoiced") != true && showInvoiced == false)))
				{
				  var thisCheckbox = this.$("#selectThisL"+i)[0];
				  if (thisCheckbox.checked)
				  {
					  arr.push(bkObj);
				  }
				  i++;
				}
			  });	
			  Parse.Object.destroyAll(arr).then(function(success) 
				{
				  console.log("Deleted selected objects") 
				}, function(error) {
				  console.error("Oops! Something went wrong: " + error.message + " (" + error.code + ")");
				});
			  i = 0;
			  Delivery.instances.forEach( function (bkObj) {
				if (bkObj.get("AccessKey") == appAccessCode && ((bkObj.get("invoiced") == showInvoiced)
						 || (bkObj.get("invoiced") != true && showInvoiced == false)))
				{
				  var thisCheckbox = this.$("#selectThisD"+i)[0];
				  if (thisCheckbox != undefined)
				  {
					  if (thisCheckbox.checked)
					  {
						  arr.push(bkObj);
					  }
				  }
				  else
				  {
					  
				  }
				  i++;
				}
			  });	
			  Parse.Object.destroyAll(arr).then(function(success) 
				{
				  console.log("Deleted selected objects") 
				}, function(error) {
				  console.error("Oops! Something went wrong: " + error.message + " (" + error.code + ")");
				});
			  i = 0;
			  Chasing.instances.forEach( function (bkObj) {
				if (bkObj.get("AccessKey") == appAccessCode && ((bkObj.get("invoiced") == showInvoiced)
						 || (bkObj.get("invoiced") != true && showInvoiced == false)))
				{
				  var thisCheckbox = this.$("#selectThisC"+i)[0];
				  if (thisCheckbox != undefined)
				  {
					  if (thisCheckbox.checked)
					  {
						  arr.push(bkObj);
					  }
				  }
				  else
				  {

				  }
				  i++;
				}
			  });	
			  Parse.Object.destroyAll(arr).then(function(success) 
				{
				  console.log("Deleted selected objects") 
				}, function(error) {
				  console.error("Oops! Something went wrong: " + error.message + " (" + error.code + ")");
				});
		  break;
	  }
	  this.render();
	},
	
	invoiceSelected: function(e) {
		var self = this;
	  switch (state.get("filter"))
	  {
		  default:
			  var i = 0;
			  var arr = [];
			  Baling.instances.forEach( function (bkObj) {
				if (bkObj.get("AccessKey") == appAccessCode && ((bkObj.get("invoiced") == showInvoiced)
						 || (bkObj.get("invoiced") != true && showInvoiced == false)))
				{
				  var thisCheckbox = this.$("#selectThis"+i)[0];
				  if (thisCheckbox != undefined)
				  {
					  if (thisCheckbox.checked)
					  {
						if (bkObj.get("invoiced") == false)
						{
							bkObj.set("invoiced", true);
							console.log ("Invoiced "+bkObj.get("Customer"));
						}
						else
						{
							bkObj.set("invoiced", false);
							console.log ("Un-invoiced "+bkObj.get("Customer"));						
						}
						bkObj.save(null, {
							success: function(bkObj) {
								console.log('Object saved with objectId: ' + bkObj.get("Employee"));
								self.render();
							},
							error: function(bkObj, error) {
								alert('Failed to save object, with error code: ' + error.message);
							}
						});	
					  }
				  }
				  else
				  {
					 console.log('Error checkbox '  +i +' is not defined'); 
				  }
				  i++;
				}
			  });	
		  break;
		  case "loading":
			  var i = 0;
			  Loading.instances.forEach( function (bkObj) {
				if (bkObj.get("AccessKey") == appAccessCode && ((bkObj.get("invoiced") == showInvoiced)
						 || (bkObj.get("invoiced") != true && showInvoiced == false)))
				{
				  var thisCheckbox = this.$("#selectThis"+i)[0];
				  if (thisCheckbox != undefined)
				  {
					  if (thisCheckbox.checked)
					  {
						if (bkObj.get("invoiced") == false)
						{
							bkObj.set("invoiced", true);
						}
						else
						{
							bkObj.set("invoiced", false); 
						}
						bkObj.save(null, {
							success: function(bkObj) {
								console.log('Object saved with objectId: ' + bkObj.id);
								self.render();
							},
							error: function(bkObj, error) {
								alert('Failed to save object, with error code: ' + error.message);
							}
						});	
					  }
				  }
				  else
				  {
					  console.log('Error checkbox '  +i +' is not defined'); 
				  }
				  i++;
				}
			  });
		  break;
		  case "deliveries":
			  var i = 0;
			  Delivery.instances.forEach( function (bkObj) {
				if (bkObj.get("AccessKey") == appAccessCode && ((bkObj.get("invoiced") == showInvoiced)
						 || (bkObj.get("invoiced") != true && showInvoiced == false)))
				{
				  var thisCheckbox = this.$("#selectThis"+i)[0];
				  if (thisCheckbox != undefined)
				  {
					  if (thisCheckbox.checked)
					  {
						if (bkObj.get("invoiced")== false)
						{
							bkObj.set("invoiced", true);
						}
						else
						{
							bkObj.set("invoiced", false); 
						}
						bkObj.save(null, {
							success: function(bkObj) {
								console.log('Object saved with objectId: ' + bkObj.get("Employee"));
								self.render();
							},
							error: function(bkObj, error) {
								alert('Failed to save object, with error code: ' + error.message);
							}
						});	
					  }
				  }
				  i++;
				}
			  });
		  break;
		  case "chasing":
			  var i = 0;
			  Chasing.instances.forEach( function (bkObj) {
				if (bkObj.get("AccessKey") == appAccessCode && ((bkObj.get("invoiced") == showInvoiced)
						 || (bkObj.get("invoiced") != true && showInvoiced == false)))
				{
				  var thisCheckbox = this.$("#selectThis"+i)[0];
				  if (thisCheckbox != undefined)
				  {
					  if (thisCheckbox.checked)
					  {
						if (bkObj.get("invoiced") == false)
						{
							bkObj.set("invoiced", true);
						}
						else
						{
							bkObj.set("invoiced", false); 
						}
						bkObj.save(null, {
							success: function(bkObj) {
								console.log('Object saved with objectId: ' + bkObj.get("Employee"));
								self.render();
							},
							error: function(bkObj, error) {
								alert('Failed to save object, with error code: ' + error.message);
							}
						});	
					  }
				  }
				  else
				  {
					  console.log('Error checkbox '  +i +' is not defined'); 
				  }
				  i++;
				}
			  });
		  break;
		  case "all":
			  var i = 0;
			  var arr = [];
			  Baling.instances.forEach( function (bkObj) {
				if (bkObj.get("AccessKey") == appAccessCode && ((bkObj.get("invoiced") == showInvoiced)
						 || (bkObj.get("invoiced") != true && showInvoiced == false)))
				{
				  var thisCheckbox = this.$("#selectThis"+i)[0];
				  if (thisCheckbox != undefined)
				  {
					  if (thisCheckbox.checked)
					  {
						if (bkObj.get("invoiced") == false)
						{
							bkObj.set("invoiced", true);
						}
						else
						{
							bkObj.set("invoiced", false); 
						}
						bkObj.save(null, {
							success: function(bkObj) {
								console.log('Object saved with objectId: ' + bkObj.get("Employee"));
								self.render();
							},
							error: function(bkObj, error) {
								alert('Failed to save object, with error code: ' + error.message);
							}
						});	
					  }
				  }
				  else
				  {
					  console.log('Error checkbox '  +i +' is not defined'); 
				  }
				  i++;
				}
			  });
			  i = 0;
			  Loading.instances.forEach( function (bkObj) {
				if (bkObj.get("AccessKey") == appAccessCode && ((bkObj.get("invoiced") == showInvoiced)
						 || (bkObj.get("invoiced") != true && showInvoiced == false)))
				{
				  var thisCheckbox = this.$("#selectThisL"+i)[0];
				  if (thisCheckbox != undefined)
				  {
					  if (thisCheckbox.checked)
					  {
						if (bkObj.get("invoiced") == false)
						{
							bkObj.set("invoiced", true);
						}
						else
						{
							bkObj.set("invoiced", false); 
						}
						bkObj.save(null, {
							success: function(bkObj) {
								console.log('Object saved with objectId: ' + bkObj.get("Employee"));
								self.render();
							},
							error: function(bkObj, error) {
								alert('Failed to save object, with error code: ' + error.message);
							}
						});	
					  }
				  }
				  else
				  {
					  console.log('Error checkbox '  +i +' is not defined'); 
				  }
				  i++;
				}
			  });
			  i = 0;
			  Delivery.instances.forEach( function (bkObj) {
				if (bkObj.get("AccessKey") == appAccessCode && ((bkObj.get("invoiced") == showInvoiced)
						 || (bkObj.get("invoiced") != true && showInvoiced == false)))
				{
				  var thisCheckbox = this.$("#selectThisD"+i)[0];
				  if (thisCheckbox != undefined)
				  {
					  if (thisCheckbox.checked)
					  {
						if (bkObj.get("invoiced")== false)
						{
							bkObj.set("invoiced", true);
						}
						else
						{
							bkObj.set("invoiced", false); 
						}
						bkObj.save(null, {
							success: function(bkObj) {
								console.log('Object saved with objectId: ' + bkObj.get("Employee"));
								self.render();
							},
							error: function(bkObj, error) {
								alert('Failed to save object, with error code: ' + error.message);
							}
						});	
					  }
				  }
				  i++;
				}
			  });
			  i = 0;
			  Chasing.instances.forEach( function (bkObj) {
				if (bkObj.get("AccessKey") == appAccessCode && ((bkObj.get("invoiced") == showInvoiced)
						 || (bkObj.get("invoiced") != true && showInvoiced == false)))
				{
				  var thisCheckbox = this.$("#selectThisC"+i)[0];
				  if (thisCheckbox != undefined)
				  {  
					  if (thisCheckbox.checked)
					  {
						if (bkObj.get("invoiced") == false)
						{
							bkObj.set("invoiced", true);
						}
						else
						{
							bkObj.set("invoiced", false); 
						}
						bkObj.save(null, {
							success: function(bkObj) {
								console.log('Object saved with objectId: ' + bkObj.get("Employee"));
								self.render();
							},
							error: function(bkObj, error) {
								alert('Failed to save object, with error code: ' + error.message);
							}
						});	
					  }
				  }
				  else
				  {
					  
				  }
				  i++;
				}
			  });
		  break;
	  }
  },
	
	edit: function(e) {
		//test to see if it has an input element...
		if (e.currentTarget.childNodes.length < 2 && e.currentTarget.className != "table-header" && e.currentTarget.className != "null"
		 && e.currentTarget.className != "table-headerH1" && e.currentTarget.className != "createdAt")
		{
			//if it doesn't create one
			//e.currentTarget.className = "editing";
			var text = e.currentTarget.textContent;
			e.currentTarget.textContent = "";
			var element1 = document.createElement("input");
			$(element1).width(100);
			$(e.currentTarget).css("background-color", "#BAD3EA");
			element1.className = "rowInput";
			element1.value = text;
			e.currentTarget.appendChild(element1);
						
			var x = window.scrollX, y = window.scrollY;
			element1.focus();
			window.scrollTo(x, y);
		}
		else
		{
			//else delete it and remove the class name?
			
		}
	},
	finishEditing: function(e) {
		//sort out its parent td element
		var parent = e.currentTarget.parentNode;
		$(parent).css("background-color", "#ffffff");
		var columnChanged = parent.className;
		$(parent).empty();		
		//parent.className = "";
		if (parent.textContent != e.currentTarget.value)
		{
			parent.textContent = e.currentTarget.value;
			
			//save in parse, gotta update the object first?
			var objFound = false;
			switch (state.get("filter"))
			{
				default:
					Baling.instances.forEach( function (bkObj) {
						if (bkObj.id == parent.value && bkObj.get("AccessKey") == appAccessCode && !objFound)
						{
							if (bkObj.className != "null")
							{
								bkObj.set(columnChanged, parent.textContent);
								bkObj.save(null, {
										success: function(bkObj) {
										console.log('Object saved with objectId: ' + bkObj.get("Employee"));
									},
									error: function(bkObj, error) {
										alert('Failed to save object, with error code: ' + error.message);
									}
								});	
								objFound = true;
							}
						}
					});
				break;
				case "loading":
					Loading.instances.forEach( function (bkObj) {
						if (bkObj.id == parent.value && bkObj.get("AccessKey") == appAccessCode && !objFound)
						{
							if (bkObj.className != "null")
							{
								bkObj.set(columnChanged, parent.textContent);
								bkObj.save(null, {
										success: function(bkObj) {
										console.log('Object saved with objectId: ' + bkObj.get("Employee"));
									},
									error: function(bkObj, error) {
										alert('Failed to save object, with error code: ' + error.message);
									}
								});	
								objFound = true;
							}
						}
					});
				break;
				case "chasing":
					Chasing.instances.forEach( function (bkObj) {
						if (bkObj.id == parent.value && bkObj.get("AccessKey") == appAccessCode && !objFound)
						{
							if (bkObj.className != "null")
							{
								bkObj.set(columnChanged, parent.textContent);
								bkObj.save(null, {
										success: function(bkObj) {
										console.log('Object saved with objectId: ' + bkObj.get("Employee"));
									},
									error: function(bkObj, error) {
										alert('Failed to save object, with error code: ' + error.message);
									}
								});	
								objFound = true;
							}
						}
					});
				break;
				case "deliveries":
					Delivery.instances.forEach( function (bkObj) {
						if (bkObj.id == parent.value && bkObj.get("AccessKey") == appAccessCode && !objFound)
						{
							if (bkObj.className != "null")
							{
								bkObj.set(columnChanged, parent.textContent);
								bkObj.save(null, {
										success: function(bkObj) {
										console.log('Object saved with objectId: ' + bkObj.get("Employee"));
									},
									error: function(bkObj, error) {
										alert('Failed to save object, with error code: ' + error.message);
									}
								});	
								objFound = true;
							}
						}
					});
				break;
				case "all":
					Baling.instances.forEach( function (bkObj) {
						if (bkObj.id == parent.value && bkObj.get("AccessKey") == appAccessCode && !objFound)
						{
							if (bkObj.className != "null")
							{
								bkObj.set(columnChanged, parent.textContent);
								bkObj.save(null, {
										success: function(bkObj) {
										console.log('Object saved with objectId: ' + bkObj.get("Employee"));
									},
									error: function(bkObj, error) {
										alert('Failed to save object, with error code: ' + error.message);
									}
								});	
								objFound = true;
							}
						}
					});
					Loading.instances.forEach( function (bkObj) {
						if (bkObj.id == parent.value && bkObj.get("AccessKey") == appAccessCode && !objFound)
						{
							if (bkObj.className != "null")
							{
								bkObj.set(columnChanged, parent.textContent);
								bkObj.save(null, {
										success: function(bkObj) {
										console.log('Object saved with objectId: ' + bkObj.get("Employee"));
									},
									error: function(bkObj, error) {
										alert('Failed to save object, with error code: ' + error.message);
									}
								});	
								objFound = true;
							}
						}
					});
					Delivery.instances.forEach( function (bkObj) {
						if (bkObj.id == parent.value && bkObj.get("AccessKey") == appAccessCode && !objFound)
						{
							if (bkObj.className != "null")
							{
								bkObj.set(columnChanged, parent.textContent);
								bkObj.save(null, {
										success: function(bkObj) {
										console.log('Object saved with objectId: ' + bkObj.get("Employee"));
									},
									error: function(bkObj, error) {
										alert('Failed to save object, with error code: ' + error.message);
									}
								});	
								objFound = true;
							}
						}
					});
					Chasing.instances.forEach( function (bkObj) {
						if (bkObj.id == parent.value && bkObj.get("AccessKey") == appAccessCode && !objFound)
						{
							if (bkObj.className != "null")
							{
								bkObj.set(columnChanged, parent.textContent);
								bkObj.save(null, {
										success: function(bkObj) {
										console.log('Object saved with objectId: ' + bkObj.get("Employee"));
									},
									error: function(bkObj, error) {
										alert('Failed to save object, with error code: ' + error.message);
									}
								});	
								objFound = true;
							}
						}
					});
				break;
			}

			//this.render();
		}
	},
	
	keypressInput: function(e) {
		if (e.keyCode == 13)
		{this.finishEditing(e);}
	},
	
	toggleAllSelected: function () {
	  this.allCheckbox = this.$("#select-all")[0];
      var Selected = this.allCheckbox.checked;
	  switch (state.get("filter"))
	  {
		  default:
			  var i = 0;
			  Baling.instances.forEach( function (bkObj) {
				if (bkObj.get("AccessKey") == appAccessCode && ((bkObj.get("invoiced") == showInvoiced)
						 || (bkObj.get("invoiced") != true && showInvoiced == false)))
				{
				    var thisCheckbox = this.$("#selectThis"+i)[0];
					if (thisCheckbox != undefined)
					{
						thisCheckbox.checked = Selected;
					}
				    i++;
				}
			  });
		  break;
		  case "loading":
			  var i = 0;
			  Loading.instances.forEach( function (bkObj) {
				if (bkObj.get("AccessKey") == appAccessCode && ((bkObj.get("invoiced") == showInvoiced)
						 || (bkObj.get("invoiced") != true && showInvoiced == false)))
				{
				    var thisCheckbox = this.$("#selectThis"+i)[0];
					if (thisCheckbox != undefined)
					{
						thisCheckbox.checked = Selected;
					}
				    i++;
				}
			  });
		  break;
		  case "deliveries":
			  var i = 0;
			  Delivery.instances.forEach( function (bkObj) {
				if (bkObj.get("AccessKey") == appAccessCode && ((bkObj.get("invoiced") == showInvoiced)
						 || (bkObj.get("invoiced") != true && showInvoiced == false)))
				{
				    var thisCheckbox = this.$("#selectThis"+i)[0];
					if (thisCheckbox != undefined)
					{
						thisCheckbox.checked = Selected;
					}
				    i++;
				}
			  });
		  break;
		  case "chasing":
			  var i = 0;
			  Chasing.instances.forEach( function (bkObj) {
				if (bkObj.get("AccessKey") == appAccessCode && ((bkObj.get("invoiced") == showInvoiced)
						 || (bkObj.get("invoiced") != true && showInvoiced == false)))
				{
				    var thisCheckbox = this.$("#selectThis"+i)[0];
					if (thisCheckbox != undefined)
					{
						thisCheckbox.checked = Selected;
					}
				    i++;
				}
			  });
		  break;
		  case "all":
			  var i = 0;
			  Baling.instances.forEach( function (bkObj) {
				if (bkObj.get("AccessKey") == appAccessCode && ((bkObj.get("invoiced") == showInvoiced)
						 || (bkObj.get("invoiced") != true && showInvoiced == false)))
				{
				    var thisCheckbox = this.$("#selectThis"+i)[0];
					if (thisCheckbox != undefined)
					{
						thisCheckbox.checked = Selected;
					}
				    i++;
				}
			  });
		  break;
	  }
	 },
	 
	toggleAllSelectedL: function () {
		this.allCheckbox = this.$("#select-allL")[0];
		var Selected = this.allCheckbox.checked;
	  var i = 0;
	  Loading.instances.forEach( function (bkObj) {
				if (bkObj.get("AccessKey") == appAccessCode && ((bkObj.get("invoiced") == showInvoiced)
						 || (bkObj.get("invoiced") != true && showInvoiced == false)))
				{
				    var thisCheckbox = this.$("#selectThisL"+i)[0];
					if (thisCheckbox != undefined)
					{
						thisCheckbox.checked = Selected;
					}
				    i++;
				}
			  });
	 },
	 
	toggleAllSelectedD: function () {
	  this.allCheckbox = this.$("#select-allD")[0];
		var Selected = this.allCheckbox.checked;
	  var i = 0;
	  Delivery.instances.forEach( function (bkObj) {
				if (bkObj.get("AccessKey") == appAccessCode && ((bkObj.get("invoiced") == showInvoiced)
						 || (bkObj.get("invoiced") != true && showInvoiced == false)))
				{
				    var thisCheckbox = this.$("#selectThisD"+i)[0];
					if (thisCheckbox != undefined)
					{
						thisCheckbox.checked = Selected;
					}
				    i++;
				}
			  });
	 },
	 
	toggleAllSelectedC: function () {
	  this.allCheckbox = this.$("#select-allC")[0];
		var Selected = this.allCheckbox.checked;
	  var i = 0;
	  Chasing.instances.forEach( function (bkObj) {
				if (bkObj.get("AccessKey") == appAccessCode && ((bkObj.get("invoiced") == showInvoiced)
						 || (bkObj.get("invoiced") != true && showInvoiced == false)))
				{
				    var thisCheckbox = this.$("#selectThisC"+i)[0];
					if (thisCheckbox != undefined)
					{
						thisCheckbox.checked = Selected;
					}
				    i++;
				}
			  });
	 },
	 
  });
  
  var emailChangeView = Parse.View.extend({
    events: {
      "submit form.submit-form": "submit",
	  "submit form.cancel-form": "cancel",
	},
    el: ".content",
    
    initialize: function() {
      this.render();
    },

    submit: function(e) {
      var self = this;      
	  var newEmail = this.$("#emailEntry").val();
	  this.$(".submit-form button").attr("disabled", "disabled");
	    var query = new Parse.Query(accessKeys);
		query.equalTo("AccessKey", appAccessCode);
		query.find({
		success: function(results) {
			// Do something with the returned Parse.Object values
			if (results.length > 0) {
				for (var i = 0; i < results.length; i++) { 
				  currentAccessObject = results[i];
				  i = results.length;
				  currentAccessObject.set("EmailAddress", newEmail);	  
				  currentAccessObject.save(null, {
					success: function() {
						emailAddress = newEmail;
						//open the next screen...
						new ManageTodosView();
					    document.getElementById("user-info").innerHTML ="App password is: " +appAccessCode +", usernames are up to the individual users and will appear in the employee column.";	
					    if (emailAddress != string.empty)
					    {
						   document.getElementById("user-info").innerHTML += "<br />The app will send usage emails to: " +emailAddress;		
					    }
						self.undelegateEvents();
						delete self;
					  },
					  error: function(results, error) {
						alert(error.message);
						self.$(".submit-form button").removeAttr("disabled");
					  }
				  });
				}
			}else {
				alert(error.message);
				self.$(".submit-form button").removeAttr("disabled");
			}
		},
        error: function(results, error) {
		  alert(error.message);
          self.$(".submit-form button").removeAttr("disabled");
        }
      });
      return false;
    },
	
	cancel: function(e) {
	  var self = this;
	  //open the next screen...
	  new ManageTodosView();
	  document.getElementById("user-info").innerHTML ="App password is: " +appAccessCode +", usernames are up to the individual users and will appear in the employee column.";	
	  if (emailAddress != string.empty)
	  {
		document.getElementById("user-info").innerHTML += "<br />The app will send usage emails to: " +emailAddress;		
	  }
	  self.undelegateEvents();
	  delete self;     
	  return false;
    },

    render: function() {
      this.$el.html(_.template($("#email-change-template").html()));
      this.delegateEvents();
    }
  });

  var LogInView = Parse.View.extend({
    events: {
      "submit form.login-form": "logIn",
    },

    el: ".content",
    
    initialize: function() {
      this.render();
    },

    logIn: function(e) {
      var self = this;
      var accessCode = this.$("#accessCode").val();
      this.$(".login-form button").attr("disabled", "disabled");

		var query = new Parse.Query(accessKeys);
		query.equalTo("ControllerAccessKey", accessCode);
		query.find({
		success: function(results) {
		// Do something with the returned Parse.Object values
		if (results.length > 0)
		{
			for (var i = 0; i < results.length; i++) { 
			  currentAccessObject = results[i];
			  i = results.length;
			  emailAddress = currentAccessObject.get('EmailAddress');
			  appAccessCode = currentAccessObject.get('AccessKey');
			  //if remember me is ticked then save these codes to local memory;
			  var rememberme = $("#rememberMeChecker").prop('checked');
			  if (rememberme)
			  {
				  //localStorage.app_Access_Code = appAccessCode;
				  store("AccessCode", appAccessCode); //storing the value...
				  console.log("remembering access as remember me was ticked..");
			  }else
			  {
				  //localStorage.clear();
				  store("AccessCode", null);
				  console.log("remember me not ticked. Emptying storage");
			  }
			  //open the next screen...
			  new ManageTodosView();
			  document.getElementById("user-info").innerHTML ="App password is: " +appAccessCode +", usernames are up to the individual users and will appear in the employee column.";	
			  if (emailAddress != String.empty)
			  {
				document.getElementById("user-info").innerHTML += "<br />The app will send usage emails to: " +emailAddress;		
			  }			  
			  self.undelegateEvents();
			  delete self;
			}
		}
		else
		{
			self.$(".login-form .error").html("Invalid access code. Please try again.").show();
			self.$(".login-form button").removeAttr("disabled");
		}
		},
        error: function(results, error) {
          self.$(".login-form .error").html("Invalid access code. Please try again.").show();
          self.$(".login-form button").removeAttr("disabled");
        }
      });

      return false;
    },

    render: function() {
      this.$el.html(_.template($("#login-template").html()));
      this.delegateEvents();
    }
	
	
  });

  // The main view for the app
  var AppView = Parse.View.extend({
    // bind the skeleton of the App already present in the HTML.
    el: $("#app"),

    initialize: function() {
      this.render();
    },

    render: function() {
		//test to see if Address and appAccessCode are in local memory;
		//appAccessCode = localStorage.app_Access_Code;
		appAccessCode = store("AccessCode"); //retrieving code...
		
      if (appAccessCode != null) {
			var query = new Parse.Query(accessKeys);
			query.equalTo("AccessKey", appAccessCode);
			query.find({
			success: function(results) {
				// Do something with the returned Parse.Object values
				if (results.length > 0)
				{
					for (var i = 0; i < results.length; i++) { 
					  currentAccessObject = results[i];
					  i = results.length;
					  emailAddress = currentAccessObject.get('EmailAddress');
					  //open the next screen...
					  new ManageTodosView();
					  document.getElementById("user-info").innerHTML ="App password is: " +appAccessCode +", usernames are up to the individual users and will appear in the employee column.";	
					  /*if (emailAddress != string.empty)
					  {
						document.getElementById("user-info").innerHTML += "<br />The app will send usage emails to: " +emailAddress;		
					  }*/
					}
			    }
				else
				{
					alert("Error: Unable to log in");
					new LogInView();
				}
			},
			error: function(results, error) {
			  alert("Error: Unable to log in.");
			  new LogInView();
			}
		  });
      } else {
        new LogInView();
      }
    }
  });

  var AppRouter = Parse.Router.extend({
    routes: {
	  "all": "all",
      "baling": "baling",
      "chasing": "chasing",
      "deliveries": "deliveries",
	  "loading": "loading"
    },

    initialize: function(options) {
    },
	
	all: function() {
      state.set({ filter: "all" });
    },

    baling: function() {
      state.set({ filter: "baling" });
    },
    chasing: function() {
      state.set({ filter: "chasing" });
    },
    deliveries: function() {
      state.set({ filter: "deliveries" });
    },
	loading: function() {
      state.set({ filter: "loading" });
    }
  });

  var state = new AppState;

  new AppRouter;
  new AppView;
  Parse.history.start();
});
