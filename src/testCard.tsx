import { FC, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Group, Image, KonvaNodeComponent, Rect, Text } from "react-konva";
import { MyLayer } from "./App";
import { Html, Portal } from "react-konva-utils";
import { Rect as IRect, RectConfig } from "konva/lib/shapes/Rect";
import { Group as IGroup } from "konva/lib/Group";

interface ProductCardProps {
  imageUrl: string;
  title: string;
  description: string;
  buttonText: string;
  width: number;
  x: number;
  y: number;
  layerRef: React.RefObject<MyLayer>
}

const ProductCard: FC<ProductCardProps> = () => {
  const [cardHeight, setCardHeight] = useState(0);
  const rectRef = useRef<IRect>(null)
  const groupRef = useRef<IGroup>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true);


  const portalTarget = document.getElementById('_cards');

  useEffect(() => {
    if (!rectRef.current) return;
    if (!cardRef.current) return;
    if (rectRef.current.isDragging()) {
      const { x, y } = rectRef.current.getPosition()
      cardRef.current.style.top = `${y}px`
      cardRef.current.style.left = `${x}px`
    }


  }, []);

  useEffect(() => {
    window.addEventListener('layerShift', handleLayerShift)
    return () => {
      window.removeEventListener('layerShift', handleLayerShift)
    }
  }, [])

  const handleLayerShift = (e: any) => {
    const { x, y } = e.detail
    console.log(x,y)
    
    const vis = x < 0 && y < 0 || x > window.innerWidth && y > window.innerHeight
    setVisible(!vis)
    console.log(!vis)
  }

  const handleVisible = () => {

  }

  const handleDragMove = (e: any) => {
    if (!groupRef.current) return;
    // Пример обработки перетаскивания
    // const { x, y } = e.target.getClientRect(); // Получаем новые координаты
    const { x, y } = e.target.getPosition(); // Получаем новые координаты
    console.log('Dragging to:', x, y); // Можно обработать координаты перетаскивания

    // const { x, y } = rectRef.current.getPosition()
    // groupRef.current.style.top = `${y}px`
    // groupRef.current.style.left = `${x}px`

    groupRef.current.setPosition(e.target.getPosition())
  };

  const handleDragStart = (e: any) => {
    console.log('Drag started');
  };

  const handleDragEnd = (e: any) => {
    console.log('Drag ended')
  }


  if (!portalTarget) return null;

  return (
    <>
      <Group>
        <Rect
          x={100}
          y={100}
          width={100}
          height={100}
          fill={'#f0f0f0'}
          draggable={true}
          // ref={rectRef}
          onDragMove={handleDragMove} // Обработчик движения
          onDragStart={handleDragStart} // Обработчик начала перетаскивания
          onDragEnd={handleDragEnd} // Обработчик завершения перетаскивания
        />
      </Group>
      <Group ref={groupRef}>
        <Html divProps={{ style: { pointerEvents: 'none', visibility: visible ? 'visible' : 'hidden' } }} >
          <div className="card"
            // onDrag
            onDrag={handleDragMove} // Обработчик движения
            onDragStart={handleDragStart} // Обработчик начала перетаскивания
            onDragEnd={handleDragEnd} // Обработчик завершения перетаскивания
          >
            <div className="anim"></div>
          </div>

        </Html>
      </Group>
      {/* <Portal selector="#_cards">
        <div className="card">123</div>
      </Portal> */}
    </>
    // , createPortal(<div className="card"></div>, portalTarget)
  );
};

export default ProductCard;