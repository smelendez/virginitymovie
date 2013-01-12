var freeze = false;
var nopulse = false;
function nodeclick(d) {
    open(d.fields.link);

}
function randInt(x, y) {
    return Math.floor(Math.random() * (y-x) + x);
}
function nodemouseover(d) {
    freeze = true;
    d3.select("#tooltip").text(d.fields.title);

}
function nodemouseout(d) {
    freeze = false;
    d3.select("#tooltip").text("");
}

function initialize (){

    var nodemap = {};
    var width = 960;
    var height = 500;

    var force = d3.layout.force()
        .charge(-40)
        .linkDistance(30)
        .size([width - 50,height]);

    svg = d3.select("#circles").append("svg")
        .attr("width", width)
        .attr("height", height);



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
        .attr("r", function(d) {var r= randInt(5, 10); if (r > 7) {d.up = true;} else d.up = false; return r;})
        .style("fill", "grey")
        .on("click", nodeclick)
        .on("mouseover", nodemouseover)
        .on("mouseout", nodemouseout)
        .attr("id", function(d) {return d.pk;})
        .call(force.drag);

        var link = svg.selectAll("line.links")
        .data(links)
        .enter().append("line")
        .attr("class", "link");

        var whichtick = 0;
        force.on("tick", function() {
            if(freeze) return;
            link.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            
             node.attr("cx", function(d) { return d.x;})
                .attr("cy", function(d) { return d.y;});

                

        }); // tick

        d3.timer(function(){
            var amount = 0.1;
            if(freeze) return;
            if (nopulse) {
                node.attr("r", 7.5);

            }
            
            node.attr("r", function(d) {
                var r = parseFloat(this.getAttribute("r"));
                if (d.up)
                {
                    r += amount;

                    if (r > 10)
                    {
                        r -= amount;
                        d.up = false;
                    }

                }
                else
                {
                    r -= amount;

                    if (r < 5)
                    {
                        r += amount;
                        d.up = true;
                    }
                }
                return r;
                


            });

        }, 1000);


        function select_tag(tag, category){
            var tagnodes = [];
            links = [];
            force.links(links);
            d3.json("/api/tag/" + tag + "/" + category + "/stories", function (error, entries) {
                node.style("fill","grey");
                entries.forEach(function(story) {
                    var storynode = nodemap[story.pk];
                    document.getElementById(story.pk).style.fill="red";

                    var ntagnodes = tagnodes.length;
                    tagnodes.push(storynode);

                    if (ntagnodes > 0)
                    {
                        links.push({source: storynode, target: tagnodes[Math.floor(Math.random() * ntagnodes)]});
                    }
                    

                });

                link.data([]);
                link = link.data(links);

                link.enter().insert("line", ".node")
                    .attr("class", "link");
                link.exit().remove();

                force.start();
                

            });
        }


        d3.selectAll("a").on("click", function() {
            
            select_tag(this.text.toLowerCase(), "phrases");
            nopulse =  true;
            d3.selectAll("a").attr("class","unselected");
            this.setAttribute("class", "selected");

        });


    });
}

initialize();
        


        

