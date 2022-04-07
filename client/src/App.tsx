import React, { useEffect, useState } from "react";
import "./App.css";
interface Pixeles {
  x: number;
  y: number;
  color: string;
}

//lifycile game
/**
 * select the pixel on the canvas
 * select color for new pixel;
 * insert pixel on the canvas to Array;
 * add new pixel to the canvas with enter key useEffect
 * add pixel, but if exits on array replace the color
 */

const useKey = (key: string, cb: () => void) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === key) {
        cb();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [key, cb]);
};

export default function App() {
  const [pixeles, setPixeles] = useState<Pixeles[]>([]);
  const [dimensions, setDimensions] = useState<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0,
  });
  const [selectionPixel, setSelectionPixel] = useState<{
    x: number;
    y: number;
    color: string;
  }>({
    x: 0,
    y: 0,
    color: "#000",
  });
  const setNewPixel = () => {
    setPixeles([
      ...pixeles,
      {
        x: selectionPixel.x,
        y: selectionPixel.y,
        color: selectionPixel.color,
      },
    ]);
  };
  useKey("Enter", setNewPixel);

  const redondearAMultiplosDe5 = (x: number) => {
    return x % 5 === 0 ? x : x + 5 - (x % 5);
  };

  const onMouseHandler = (e: any) => {
    console.log("clicked");
    let cPosition = e.target.getBoundingClientRect();
    let x = redondearAMultiplosDe5(e.clientX - cPosition.x) - 5;
    let y = redondearAMultiplosDe5(e.clientY - cPosition.y) - 5;
    setDimensions({
      x,
      y,
    });
    setSelectionPixel({
      x,

      y,
      color: selectionPixel.color,
    });
  };

  return (
    <div className="App">
      <div className="dimensions-info">
        <span>
          <b>x:</b>
          {dimensions.x}
        </span>
        <span>
          <b>y: </b>
          {dimensions.y}
        </span>
      </div>
      <div className="canvas">
        <div id="div-canvas">
          <div className="canvas-reference" onClick={onMouseHandler}></div>
          <svg id="canvas" width={1000} height={500} viewBox="0 0 1000 500">
            {pixeles.map((item, i) => {
              return (
                <rect
                  key={i}
                  id="rect"
                  x={item.x}
                  y={item.y}
                  width={5}
                  height={5}
                  fill={item.color}
                ></rect>
              );
            })}
            {selectionPixel && (
              <rect
                id="pixel-select"
                x={selectionPixel.x}
                y={selectionPixel.y}
                width={5}
                height={5}
                stroke="#fff"
              ></rect>
            )}
          </svg>
        </div>
      </div>
      <div className="options">
        {/* select color for new pixel; */}
        <input
          type="color"
          onChange={(e) => {
            setSelectionPixel({
              ...selectionPixel,
              color: e.target.value,
            });
          }}
        />
        {/* insert pixel on the canvas to Array; */}
        <button
          className="button"
          onClick={() => {
            setNewPixel();
          }}
        >
          ok
        </button>
        <div className="colors-selected"></div>
      </div>
    </div>
  );
}
