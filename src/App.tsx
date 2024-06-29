import { FC, useEffect, useRef, useState } from 'react'
import { Circle, Layer, Line, Rect, Stage } from 'react-konva'
import './css/globals.scss'
import { KonvaEventObject } from 'konva/lib/Node'
import Konva from 'konva'
import gsap, { Cubic } from 'gsap'
import { Vector2d } from 'konva/lib/types'
import ProductCard from './testCard'

let anim: gsap.core.Tween = {} as gsap.core.Tween;

interface IOptions {
  x: number,
  y: number
  targetX: number,
  targetY: number,
  scaleX: number,
  scaleY: number,
  targetScaleX: number,
  targetScaleY: number,
  dragging: boolean,
  space: boolean,
  lastPosition: {
    x: number,
    y: number
  },
  velocity: {
    x: number,
    y: number
  },
}

interface MyLayer extends Konva.Layer {
  _attrs: IOptions
}

function App() {
  const [count, setCount] = useState(0)
  const layerRef = useRef<MyLayer>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const pointRef = useRef<Konva.Circle>(null);

  const _OPTIONS = useRef<IOptions>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    scaleX: 1,
    scaleY: 1,
    targetScaleX: 1,
    targetScaleY: 1,
    dragging: false,
    space: false,
    lastPosition: {
      x: 0,
      y: 0,
    },
    velocity: {
      x: 0,
      y: 0,
    }
  }).current

  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault()
    if (!stageRef.current) return
    if (!layerRef.current) return
    if (!pointRef.current) return
    const layer = layerRef.current
    const stage = stageRef.current
    const [deltaX, deltaY] = [e.evt.deltaX, e.evt.deltaY]

    let x = layer.attrs.x;
    let y = layer.attrs.y;
    if (e.evt.ctrlKey) {
      let x = 0;
      let y = 0;
      const pointerPosition = stage.getPointerPosition();
      // console.log(pointerPosition)
      // layer.scale({x: layer.getAbsoluteScale().x + (-deltaY / 100), y: layer.getAbsoluteScale().y + (-deltaY / 100)})
      scale(layer, _OPTIONS, -deltaY, pointerPosition);
      return
    }
    y = -deltaY
    x = -deltaX
    if (e.evt.shiftKey) {
      x = -deltaY
      y = 0
      // layer.x(layer.attrs.x + -deltaY || deltaX)
    } else {
      // layer.y(layer.attrs.y + -deltaY)
      // layer.x(layer.attrs.x + -deltaX)
      // layer.to({y})
    }
    _OPTIONS.targetX += x
    _OPTIONS.targetY += y
    // layer.batchDraw()
    // console.log(layer.getAbsoluteScale())
    handleGo(layer, _OPTIONS)
    // layer.to({x: layer._attrs.targetX, y: layer._attrs.targetY})
  }

  const handlePointerMove = (e: KonvaEventObject<PointerEvent>) => {
  }


  useEffect(() => {
    const stage = stageRef.current;
    const layer = layerRef.current;
    if (!stage) return;
    if (!layer) return;

    // createInitialGrid(layer);

    const handlePointerDown = (e: Konva.KonvaEventObject<PointerEvent>) => {
      
      console.log(e.evt.button)
      if(e.evt.button === 1) _OPTIONS.space = true
      if (_OPTIONS.space) {
        _OPTIONS.dragging = true;
        _OPTIONS.lastPosition = { x: e.evt.clientX, y: e.evt.clientY };
      }
    };

    const handlePointerMove = (e: Konva.KonvaEventObject<PointerEvent>) => {
      if (_OPTIONS.dragging) {
        const layer = layerRef.current;
        if (layer && _OPTIONS.lastPosition) {
          const dx = e.evt.clientX - _OPTIONS.lastPosition.x;
          const dy = e.evt.clientY - _OPTIONS.lastPosition.y;
          
          _OPTIONS.lastPosition = { x: e.evt.clientX, y: e.evt.clientY };
          _OPTIONS.velocity = { x: dx, y: dy };
          _OPTIONS.targetX = _OPTIONS.x + dx
          _OPTIONS.targetY = _OPTIONS.y + dy
          handleGo(layer, _OPTIONS, 0)
          // lay er.batchDraw();
        }
      }
    };

    const handlePointerUp = (e: Konva.KonvaEventObject<PointerEvent>) => {
      _OPTIONS.dragging = false;
      if (_OPTIONS.space) {
        applyInertia();
      }
      if(e.evt.button === 1) _OPTIONS.space = false
      _OPTIONS.velocity = { x: 0, y: 0 };
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        _OPTIONS.space = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        _OPTIONS.space = false;
        if (_OPTIONS.dragging) {
          applyInertia();
        }
      }
    };

    const applyInertia = () => {
      const layer = layerRef.current;
      if (layer) {
        const { x: vx, y: vy } = _OPTIONS.velocity;
        _OPTIONS.targetX = _OPTIONS.x + vx * 100 
        _OPTIONS.targetY = _OPTIONS.y + vy * 100 
        
        handleGo(layer, _OPTIONS, 0.8)
      }
    };

    stage.on('pointerdown', handlePointerDown);
    stage.on('pointermove', handlePointerMove);
    stage.on('pointerup', handlePointerUp);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      stage.off('pointerdown', handlePointerDown);
      stage.off('pointermove', handlePointerMove);
      stage.off('pointerup', handlePointerUp);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);


  return (
    <>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onWheel={handleWheel}
        culling={true}
        cullingPadding={10}
        ref={stageRef}
        onPointerMove={handlePointerMove}
      >

        <Layer ref={layerRef} x={0} y={0} fill={'#fff0df'}>
          {/* <Grid width={window.innerWidth * 2} height={window.innerHeight * 2} cellSize={100} /> */}
          <Rect width={50} height={50} fill="red" />
          <Circle x={200} y={200} stroke="black" radius={50} ref={pointRef} />
          <ProductCard x={300} y={300} imageUrl={''} title={'Lorem ipsum dolor set amet'} description={'Lorem ipsum dolor set ametLorem ipsum dolor set ametLorem ipsum dolor set amet'} buttonText={'Кнапка'} width={300}/>
        </Layer>
      </Stage>
    </>
  )
}

export default App


interface IGrid {
  width: number,
  height: number,
  cellSize: number
}

const Grid: FC<IGrid> = (props: IGrid) => {
  const gridColor = 'lightgray';
  const gridWidth = 1;

  const lines = [];

  // горизонтальные линии
  for (let i = 0; i <= props.height; i += props.cellSize) {
    lines.push(
      <Line
        key={`h-${i}`}
        points={[0, i, props.width, i]}
        stroke={gridColor}
        strokeWidth={gridWidth}
        dash={[5, 5]}
      />
    );
  }

  // вертикальные линии
  for (let j = 0; j <= props.width; j += props.cellSize) {
    lines.push(
      <Line
        key={`v-${j}`}
        points={[j, 0, j, props.height]}
        stroke={gridColor}
        strokeWidth={gridWidth}
        dash={[5, 5]}
      />
    );
  }

  return lines;
};


function scale(layer: MyLayer, options: IOptions, deltaY: number, pointerPosition: Vector2d | null) {
  if (!pointerPosition) return
  const scaleFactor = 1.5; // коэффициент масштабирования

  const oldScale = layer.scaleX(); // Determine the new scale 
  // const newScale = deltaY > 0 ? oldScale * scaleFactor : oldScale / scaleFactor; // Calculate the pointer position relative to the stage 
  const newScale = oldScale * Math.exp(deltaY * Math.log(scaleFactor) / 100); // Calculate the pointer position relative to the stage 

  const pointer = {
    x: pointerPosition.x / oldScale - layer.x() / oldScale,
    y: pointerPosition.y / oldScale - layer.y() / oldScale,
  }; // Scale the layer



  const newPos = { x: -(pointer.x - pointerPosition.x / newScale) * newScale, y: -(pointer.y - pointerPosition.y / newScale) * newScale, };


  // устанавливаем новый масштаб и координаты layer
  // layer.x(newPos.x)
  // layer.y(newPos.y);
  // layer.scale({ x: newScale, y: newScale }); // Adjust the layer position to keep the pointer position stable 

  options.targetScaleX = newScale
  options.targetScaleY = newScale
  options.targetX = newPos.x
  options.targetY = newPos.y
  // updateGridOpacity(layer, newScale);
  handleGo(layer, options);
}

const handleGo = (layer: MyLayer, options: IOptions, type: number = 0.4) => {
  anim.kill?.()
  if (!type) {
    options.x = options.targetX
    options.y = options.targetY
    options.scaleX = options.targetScaleX
    options.scaleY = options.targetScaleY
    layer.x(options.x)
    layer.y(options.y)
    layer.scaleX(options.scaleX)
    layer.scaleY(options.scaleY)
    return
  }

  anim = gsap.to(options, {
    x: options.targetX,
    y: options.targetY,
    scaleX: options.targetScaleX,
    scaleY: options.targetScaleY,
    duration: type,
    ease: Cubic.easeOut,
    onUpdate: () => {
      // console.log(layer._attrs);
      layer.x(options.x)
      layer.y(options.y)
      // console.log(layer._attrs.scaleX)
      layer.scaleX(options.scaleX)
      layer.scaleY(options.scaleY)
    }
  })
}

const createInitialGrid = (layer: Konva.Layer) => {
  const stage = layer.getStage();
  if (!stage) return;

  const spacing = 50;
  const lineColor = '#ddd';
  const thinLineColor = '#bbb';
  const lineOpacity = 0.8;
  const thinLineOpacity = 0.3;

  const gridSize = 30000; // Размер сетки
  layer.find('.grid-line').forEach(line => line.destroy())

  // Создаем горизонтальные линии
  for (let i = -gridSize; i <= gridSize; i += spacing) {
    const isThinLine = (i / spacing) % 5 !== 0;
    layer.add(new Konva.Line({
      points: [-gridSize, i, gridSize, i],
      stroke: isThinLine ? thinLineColor : lineColor,
      strokeWidth: 1,
      opacity: isThinLine ? thinLineOpacity : lineOpacity,
      name: 'grid-line',
      listening: false,
    }));
  }

  // Создаем вертикальные линии
  for (let i = -gridSize; i <= gridSize; i += spacing) {
    const isThinLine = (i / spacing) % 5 !== 0;
    layer.add(new Konva.Line({
      points: [i, -gridSize, i, gridSize],
      stroke: isThinLine ? thinLineColor : lineColor,
      strokeWidth: 1,
      opacity: isThinLine ? thinLineOpacity : lineOpacity,
      name: 'grid-line',
      listening: false,
    }));
  }

};

const updateGridOpacity = (layer: Konva.Layer, scale: number) => {
  let tScale = scale * scale / 30 / 2 
  tScale = tScale <= 0 ? 0 : tScale
  let tWidth = (1 - scale) * 10
  console.log(scale, tScale, tWidth)
  layer.find('.grid-line').forEach((_line) => {
    let line = _line as Konva.Line
    const isThinLine = (line.points()[1] % (50 * 5) !== 0 || line.points()[0] % (50 * 5) !== 0);
    line.opacity(isThinLine ? 0.25 : 1);
    // line.strokeWidth(isThinLine ? 1 : tWidth)
  });
};