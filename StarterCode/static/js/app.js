// URL Variable
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"

// Use the D3 library to read in samples.json from the URL
let data = d3.json(url).then(function(data) {
    console.log(data);
});

//Dashboard
function init () {
    let dropdown = d3.select("#selDataset")
    d3.json(url).then(function(data) {
        let names = data.names;
        names.forEach((name) => {
            dropdown.append("option").text(name).property("value", name);
        });
        //Initialize Plots
        let initialSelection = names[0]
        Bar_Plot(initialSelection);
        Bubble_Plot(initialSelection);
        Meta_data(initialSelection);
    });
};

//Bar plot
function Bar_Plot (selected_id) {
    d3.json(url).then(function(data) { 
        let samples = data.samples
    let sample = samples.filter(sample => sample.id === selected_id)[0];
    let sample_values = sample.sample_values.slice(0,10).reverse();
    let otu_ids = sample.otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
    let otu_labels = sample.otu_labels.slice(0,10).reverse();

    //Define trace
    let trace1 = {
        x:sample_values,
        y:otu_ids,
        text:otu_labels,
        type:"bar",
        orientation:"h"
    };
    //Define layout
    let layout = {
        title: "Bar Plot"
    };
    //Plot using Plotly
    Plotly.newPlot("bar", [trace1], layout);
    });
};


//Bubble plot
function Bubble_Plot (selected_id) {
    d3.json(url).then(function(data) { 
        let samples = data.samples
    let sample = samples.filter(sample => sample.id === selected_id)[0];
    let sample_values = sample.sample_values
    let otu_ids = sample.otu_ids 
    let otu_labels = sample.otu_labels

    //Define trace
    let trace2 = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
            size: sample_values,
            color: otu_ids,
        }
    };
    //Define layout
    let layout = {
        title: "Bubble Plot",
        xaxis: {title: "OTU ID"}
    };
    //Plot using Plotly
    Plotly.newPlot("bubble", [trace2], layout);
    });
};


//Metadata
function Meta_data (selected_id) {
    d3.json(url).then(function(data) { 
        let allmetadata = data.metadata
        let metadata = allmetadata.find(sample => sample.id === selected_id);
        let metaPanel = d3.select("#sample-metadata");
        metaPanel.html("");
        if (metadata) {
            Object.entries(metadata).forEach(([key, value]) => {
                metaPanel.append("h4").text(`${key.toUpperCase()}: ${value}`);  
            });
        }
    });
};

//Changing events
function optionChanged(selected_id) {
    Bar_Plot(selected_id);
    Bubble_Plot(selected_id);
    Meta_data(selected_id);
}

init();