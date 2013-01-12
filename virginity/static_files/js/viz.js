function nodeclick(d) {

}
function nodemouseover(d) {
    this.setAttribute("r", 7);

}
function nodemouseout(d) {
    this.setAttribute("r", 5);
}

function initialize (){

    var nodemap = {};
    var width = 960;
    var height = 500;

    var force = d3.layout.force()
        .charge(-120)
        .linkDistance(30)
        .size([width, height]);

    svg = d3.select("#svg-container").append("svg")
        .attr("width", width)
        .attr("height", height);
    console.log(svg);



    d3.json("/api/allstories", function (error, entries) {
        var links = [];
        force.nodes(entries)
        .links(links)
        .start();

        force.nodes().forEach(function(n) {
            nodemap[n.pk] = n;

        });

        var node = svg.selectAll("circle.node")
        .data(entries)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", 5)
        .style("fill", "pink")
        .on("click", nodeclick)
        .on("mouseover", nodemouseover)
        .on("mouseout", nodemouseout)
        .attr("id", function(d) {return d.pk;})
        .call(force.drag);

        var link = svg.selectAll("line.links")
        .data(links)
        .enter().append("line")
        .attr("class", "link")
        .style("stroke-width", 1);

        force.on("tick", function() {
            link.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node.attr("cx", function(d) { return d.x;})
                .attr("cy", function(d) { return d.y;});

        }); // tick

        function select_tag(tag){
            var tagnodes = [];
            d3.json("/api/tag/" + tag + "/stories", function (error, entries) {
                entries.forEach(function(story) {
                    var storynode = nodemap[story.pk];

                    var ntagnodes = tagnodes.length;
                    tagnodes.push(storynode);

                    if (ntagnodes > 0)
                    {
                        links.push({source: storynode, target: tagnodes[Math.floor(Math.random() * ntagnodes)]});
                    }
                    

                });

                link = link.data(links);

                link.enter().insert("line", ".node")
                    .attr("class", "link");

                force.start();
                

            });
        }

        select_tag(15);


    });
}

initialize();
        


        

