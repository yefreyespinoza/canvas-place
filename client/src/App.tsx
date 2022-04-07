import React, { useContext, useEffect, useState } from "react";
import "./App.css";
import { AppContext } from "./context/AppContext";
interface Pixel {
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
  const { socketApp } = useContext(AppContext);
  const [colorsSelected, setColorsSelected] = useState<string[]>([]);
  const [pixeles, setPixeles] = useState<Pixel[]>([]);
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
    x: -10,
    y: -10,
    color: "#000",
  });
  const setNewPixel = () => {
    socketApp.emit("coordinate", {
      x: selectionPixel.x,
      y: selectionPixel.y,
      color: selectionPixel.color,
    });
  };
  useKey("Enter", setNewPixel);

  const redondearAMultiplosDe5 = (x: number) => {
    return x % 5 === 0 ? x : x + 5 - (x % 5);
  };

  const onMouseHandler = (e: any) => {
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
  useEffect(() => {
    socketApp.on("coordinates", (dt: Pixel[]) => {
      setPixeles(dt);
    });
    return () => {
      socketApp.off("coordinates");
    };
  }, [socketApp]);
  useEffect(() => {
    socketApp.on("coordinate", (dt) => {
      let findPixel = pixeles.find(
        (item) => item.x === dt.x && item.y === dt.y
      );
      if (findPixel) {
        setPixeles(
          pixeles.map((item) => {
            if (item.x === dt.x && item.y === dt.y) {
              return {
                ...item,
                color: dt.color,
              };
            }
            return item;
          })
        );
      } else {
        setPixeles([
          ...pixeles,
          {
            x: dt.x,
            y: dt.y,
            color: dt.color,
          },
        ]);
      }
    });
    return () => {
      socketApp.off("coordinate");
    };
  }, [pixeles, socketApp]);

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
      <div className="canvas-container">
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
            if (colorsSelected.length < 10)
              setColorsSelected([...colorsSelected, e.target.value]);
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
        <div className="colors-selected">
          {colorsSelected.map((item, i) => {
            return (
              <button
                className="button"
                style={{ backgroundColor: item }}
              ></button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
