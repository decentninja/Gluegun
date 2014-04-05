var elm = d3.select(".graph")
var fill = d3.scale.category20()
var graph = elm
	.append("svg:svg")
	.attr("pointer-events", "all")
		.call(d3.behavior.zoom().on("zoom", function() {
		graph.attr(
			"transform",
			"translate(" + d3.event.translate + ")"+ " scale(" + d3.event.scale + ")"
		)
	}))
	.append('svg:g')


var nodes = {}
var links = []

function addData(item, from, relation) {
	if(!from) {
		from = "top"
	}
	if(item.constructor === Object) {
		for(var key in item) {
			addData(item[key], from, key)
		}
	} else if(item.constructor === Array) {
		for(var key in item) {
			addData(item[key], relation + "_" + key)
		}
	} else {	// Primitive
		links.push({
			source: nodes[from] || (nodes[from] = {name: from}),
			target: nodes[item] || (nodes[item] = {name: item}),
			type: relation
		})
	}
}

addData({
	haters: 10,		// TODO special case
	user: [
		{
			name: "Mike",
			age: 23,
			likes: "Nina",
			description: {
				bio: "Lucz i liten gård du är hård tack för den!",
				andra: "haha lol don't even mention"
			}
		},
		{
			name: "Nina",
			age: 20,
			likes: ["Charles", "Mike"]
		},
		{
			name: "Charles",
			age: 20,
			likes: "Mike"
		}
	],
	post: [
		{
			title: "Aweeseeome",
			body: "Det var en gång en gång, den var sandad.",
			by: "Mike",
			comments: [
				{
					by: "Nina",
					body: "Cooool"
				},
				{
					by: "Charles",
					body: "Thanks"
				}
			]
		},
		{
			title: "Lego!!1",
			body: "That whats 1 2 3 profit",
			by: "Rickard",
			comments: []
		}
	]
})

var force = d3.layout.force()
	.gravity(0.05)
    .charge(-1500)
    .linkDistance(100)
    .friction(0.5)
	.nodes(d3.values(nodes))
	.links(links)

function resize() {
	width = window.innerWidth, height = window.innerHeight
	graph.attr("width", width).attr("height", height)
	force.size([width, height]).resume()
}
resize()
d3.select(window).on("resize", resize)

force.start()

var link = graph.selectAll("line.link")
	.data(links)
	.enter().append("svg:line")
	.attr("class", "link")
	.attr("x1", function(d) { return d.source.x })
	.attr("y1", function(d) { return d.source.y })
	.attr("x2", function(d) { return d.target.x })
	.attr("y2", function(d) { return d.target.y })

var node = graph.selectAll("circle.node")
	.data(d3.values(nodes))
	.enter().append("svg:circle")
	.attr("class", "node")
	.attr("cx", function(d) { return d.x })
	.attr("cy", function(d) { return d.y })
	.attr("r", 7.5)
	.style("fill", function(d) { return fill(d.name)})

var text = graph.append("svg:g").selectAll("g")
    .data(force.nodes())
    .enter().append("svg:g")

text.append("svg:text")
    .attr("x", 10)
    .attr("y", 6)
	.text(function(d) {
		return d.name
	})

graph.style("opacity", 1e-6)
	.transition()
	.duration(1000)
	.style("opacity", 1)

force.on("tick", function() {
	link.attr("x1", function(d) { return d.source.x })
	    .attr("y1", function(d) { return d.source.y })
	    .attr("x2", function(d) { return d.target.x })
	    .attr("y2", function(d) { return d.target.y })

	node.attr("cx", function(d) { return d.x })
    	.attr("cy", function(d) { return d.y })

    text.attr("transform", function(d) {
		return "translate(" + d.x + "," + d.y + ")"
	})
})
