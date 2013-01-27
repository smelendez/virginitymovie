var freeze = false;
var nopulse = false;
var svg;
var selected_tag = null;
function nodeclick(d) {
    if (selected_tag)
    {
        open("/story/" + d.pk + "/tag/" + selected_tag + "/phrases");

    }
    else
    {
        open("/story/" + d.pk);
    }

}
function randInt(x, y) {
    return Math.floor(Math.random() * (y-x) + x);
}
function nodemouseover(d) {
    freeze = true;
    if(!nopulse)
    {
        svg.selectAll(".node").style("fill","grey");
        this.style.fill = "red";
    }
    d3.select("#popup").style("display", "none");
    d3.select("#tooltip").html('<span class="tooltipname">' + (d.fields.name || "Anon") + ':</span> ' + d.fields.title);

}
function nodemouseout(d) {
    freeze = false;
    if (!nopulse)
    {
        this.style.fill = "grey";
    }
    d3.select("#tooltip").text("");
}

function initialize (){

    var nodemap = {};
    var width = 600;
    var height = 500;

    var force = d3.layout.force()
        .charge(-40)
        .linkDistance(30)
        .size([width - 50,height]);

    svg = d3.select("#circles").append("svg")
        .attr("width", width)
        .attr("height", height);


    function highlight_stories(error, entries) {


    }

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
        .on("click", nodeclick, true)
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

        var timertick = 0;
        setInterval(function(){
            if(freeze) 
            {
                timertick = 0;
                d3.select("popup")
                .style("display", "none");
                return;
            }
            if (nopulse) {
                timertick = 0;
                node.attr("r", 7.5);
                return;

            }
            var amount = 0.1;
            timertick +=1;

            if (timertick % 15 == 0)
            {
                // Show popup
                var allnodes = entries;
                var numnodes = allnodes.length;
                var randnode = allnodes[randInt(0, numnodes)];
                var cx = randnode.x;
                var cy = randnode.y;
                var r = 5;
                node.style("fill", "grey");


                d3.select("#popup")
                    .style("display", "block")
                    .style("top", cy + r + "px")
                    .style("left", cx + r + "px")
                    .text(randnode.fields.name || "Anon");

                document.getElementById(randnode.pk).style.fill="red";


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

        }, 100);


        function no_tag() {
            link = link.data([]);
            link.exit().remove();
            node.style("fill", "grey");
            force.start();
            selected_tag = null;

        }
        function select_entries(error, entries) {
                links = [];
                force.links(links);
                node.style("fill","#ccc");
                var tagnodes = [];
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
                


        }

        function select_recent() {
            d3.json("/api/recent/", select_entries);

        }
        function select_tag(tag, category){
            var tagnodes = [];
            selected_tag = tag;
            d3.json("/api/tag/" + tag + "/" + category + "/stories", select_entries);
            
        }

        function search(term) {
            var tagnodes = [];
            links = [];
            force.links(links);
            d3.json("/api/search/" + term + "/stories", select_entries);
        



        }


        d3.select("aside").on("click", function() {
            d3.selectAll("a").attr("class","unselected");
            no_tag();
            nopulse = false;
            document.getElementById("searchbox").value = "Search";
            

        }, true);
        d3.selectAll("a").on("click", function() {
            
            if (this.text == "Show recent stories")
            {
                d3.select("#popup").style("display", "none");
                nopulse =  true;
                select_recent();
                d3.selectAll("a").attr("class","unselected");
                this.setAttribute("class", "selected");
                return false;
                

            }
            
            d3.select("#popup").style("display", "none");
            select_tag(this.text.toLowerCase(), "phrases");
            nopulse =  true;
            d3.selectAll("a").attr("class","unselected");
            this.setAttribute("class", "selected");
            return false;

        }, true);
        function search_submit() {
            var searchbox = document.getElementById("searchbox");
            if (!searchbox.value || searchbox.value == "Search")
            {
                searchbox.value = "Search";
                return;
            }
            // Enter
            d3.select("#popup").style("display", "none");
            search(searchbox.value);
            nopulse =  true;
            d3.selectAll("a").attr("class","unselected");

        }
        d3.select("#searchbox").on("click", function() {
            if (this.value == "Search")
            {
                this.value = "";
            }
        }).on("keyup", function () {
            if (d3.event.keyCode == 13)
            {
                search_submit();
            }
        });

        d3.select("#magglass").on("click", function () {
            search_submit();

        }, true);


    });
}

initialize();
        


        

