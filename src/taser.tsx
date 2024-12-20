import { FC, RefObject, useCallback, useEffect, useRef, useState } from "react";
import { Circle, Line } from "react-konva";
import { Vector2d } from "konva/lib/types";
import Konva from "konva";
import { Circle as ICircle } from "konva/lib/shapes/Circle";
import { Layer as ILayer } from "konva/lib/Layer";


interface TaserProps {
  id: string;

  positions: {
    [key: string]: {
      start: Vector2d;
      end: Vector2d;
    }
  };
  layerRef: React.RefObject<Konva.Layer>;
}
const _POS: any = {
}
const Taser: React.FC<TaserProps> = (props) => {
  let particleProgress = 0
  // const [particleProgress, setParticleProgress] = useState(0); // Позиция главной частицы
  const [circlePosition, setCirclePosition] = useState({ x: 0, y: 0 }); // Позиция Circle
  const [particles, setParticles] = useState<
    { x: number; y: number; radius: number; opacity: number; speedX: number; speedY: number }[]
  >([])
  const particlesRef = useRef<
    { x: number; y: number; radius: number; opacity: number; speedX: number; speedY: number }[]
  >([]);

  const start = props.positions[props.id]?.start ?? { x: 0, y: 0 };
  const end = props.positions[props.id]?.end ?? { x: 0, y: 0 };

  if(!_POS[props.id]){
    _POS[props.id] = {
      start: {x: 0, y: 0},
      end: {x: 0, y: 0}
    }
  }

  _POS[props.id].start = start
  _POS[props.id].end = end

  const generate = () => {

    const layer = props.layerRef.current;
    return new Konva.Animation((frame) => {
      if (!frame) return;

      // Обновляем движение частиц
      const particles = particlesRef.current;
      particles.forEach((particle) => {
        particle.x += particle.speedX; // Обновление координат
        particle.y += particle.speedY;
        particle.opacity = Math.max(0, particle.opacity - 0.02); // Постепенное затухание
      });

      // Убираем частицы, которые полностью исчезли
      particlesRef.current = particles.filter((particle) => particle.opacity > 0);

      setParticles(particlesRef.current)

      // console.log("GENERATE PARTICLES")
      layer?.batchDraw(); // Перерисовка слоя
    }, layer);
    // return () => anim.stop();
  };

  const getParticlePosition = () => {
    // if (props.position.start && props.position.end) {
    //   return getRandomPointOnLine(props.position.start.x, props.position.start.y, props.position.end.x, props.position.end.y)
    // } else {
    // }
    return getRandomPointOnLine(_POS[props.id].start.x, _POS[props.id].start.y, _POS[props.id].end.x, _POS[props.id].end.y)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      // Генерируем новые частицы в текущем положении Circle
      const { x, y } = getParticlePosition();

      // Добавляем новую частицу
      particlesRef.current.push({
        x,
        y,
        radius: Math.random() * 4, // Размер частицы
        opacity: 1, // Прозрачность
        speedX: Math.random() * 2 - 1, // Скорость по X
        speedY: Math.random() * 2 - 1, // Скорость по Y
      });
      // console.log("GENERATE PARTICLES", x, y)
    }, 20); // Частота генерации новых частиц
    const generator = generate();
    generator.start()

    return () => {
      clearInterval(interval)
      generator.stop()
    };
  }, []); // Генерация частиц зависит от позиции Circle

  return (
    <>
      {/* Линия */}
      <Line
        points={[start.x, start.y, end.x, end.y]}
        strokeLinearGradientStartPoint={{ x: start.x, y: start.y }}
        strokeLinearGradientEndPoint={{ x: end.x, y: end.y }}
        strokeLinearGradientColorStops={[0, "red", 1, "blue"]}
        strokeWidth={5}
      />

      {/* Частицы */}
      {particles.map((particle, index) => (
        <Circle
          key={index}
          x={particle.x}
          y={particle.y}
          radius={particle.radius}
          fill={`rgba(255,60,150,${particle.opacity})`}
        />
      ))}
    </>
  );
};

export default Taser;

function getRandomIntInInterval(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandomPointOnLine(startX: number, startY: number, endX: number, endY: number): { x: number; y: number } {
  const t = Math.random(); // Случайное число от 0 до 1
  const x = startX + t * (endX - startX);
  const y = startY + t * (endY - startY);
  return { x, y };
}