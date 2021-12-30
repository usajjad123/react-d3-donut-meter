import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const Thermostat = () => {
  const chartRef = useRef(null);

  const [angle, setAngle] = useState(45);

  const degToRad = (deg) => (deg * Math.PI) / 180;
  const radToDeg = (rad) => (rad * 180) / Math.PI;

  const handleMouse = (ev) => {
    // console.log("clicked", ev);
    const { offsetX, offsetY } = ev;
    const rad = Math.atan2(offsetY - 300, offsetX - 300);
    const curAngle = radToDeg(rad) + 90;
    // console.log("grad angle", curAngle, offsetX, offsetY);
    setAngle(curAngle);
  };

  const handleDrag = (ev) => {
    // console.log("dragging", ev);
    // const {
    //   subject: { x, y },
    //   dx,
    //   dy,
    // } = ev;
    const { layerX, layerY } = ev.sourceEvent;
    const rad = Math.atan2(layerY - 300, layerX - 300);
    const curAngle = radToDeg(rad) + 90;
    setAngle(curAngle);
  };

  const drawChart = (angle) => {
    if (chartRef.current) {
      d3.select(chartRef.current).select("svg").remove();
      const svg = d3
        .select(chartRef.current)
        .append("svg")
        .attr("width", 1000)
        .attr("height", 700);
      // .attr("transform", "translate(-500, -350)");

      const svgDefs = svg.append("defs");

      const gradDef = svgDefs
        .append("linearGradient")
        .attr("id", "grad")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "0%")
        .attr("y2", "100%")
        .attr("gradientTransform", "rotate(-90)");
      gradDef
        .append("stop")
        .attr("offset", "0%")
        .attr("style", "stop-color:rgb(0,0,255);stop-opacity:1");
      gradDef
        .append("stop")
        .attr("offset", "50%")
        .attr("style", "stop-color:#ff8d00;stop-opacity:0.8");
      gradDef
        .append("stop")
        .attr("offset", "100%")
        .attr("style", "stop-color:rgb(255,0,0);stop-opacity:1");
      const arc = d3
        .arc()
        .innerRadius(100)
        .outerRadius(150)
        .startAngle(degToRad(220))
        .endAngle(degToRad(580));
      // .endAngle(degToRad(500));
      // .endAngle(degToRad(angle + 220));

      svg
        .append("text")
        .text(`${((((angle - 220 + 360) % 360) / 280) * 40 + 30).toFixed(0)} C`)
        .attr("transform", "translate(300,300)")
        .attr("text-anchor", "middle")
        .attr("font-size", "30px")
        .attr("dy", "10");

      svg
        .append("path")
        .attr("d", arc())
        // .attr("fill", "#6996f0")
        .attr("fill", "url(#grad)")
        .attr("transform", "translate(300, 300)")
        .on("click", handleMouse)
        .call(d3.drag().on("drag", handleDrag));

      svg
        .append("path")
        .attr(
          "d",
          d3
            .arc()
            .innerRadius(100)
            .outerRadius(150)
            .startAngle(degToRad(angle))
            .endAngle(degToRad(220))()
        )
        .attr("fill", "#3a3a3a")
        .attr("transform", "translate(300, 300)")
        .on("click", handleMouse)
        .call(d3.drag().on("drag", handleDrag));
    }
  };

  useEffect(() => {
    if (angle <= 140 || angle >= 220) {
      let boundAngle = angle;
      if (boundAngle >= 180 && boundAngle <= 270) {
        boundAngle -= 360;
      }
      drawChart(boundAngle);
    }
  }, [angle]);

  return (
    <>
      {/* <defs>
        <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
          <stop
            offset="100%"
            style="stop-color:rgb(255,255,0);stop-opacity:1"
          />
        </linearGradient>
      </defs> */}
      <div ref={chartRef} style={{ display: "flex" }}></div>
    </>
  );
};

export default Thermostat;
