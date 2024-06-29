import { FC } from "react";
import { Group, Image, Rect, Text } from "react-konva";

interface ProductCardProps {
  imageUrl: string;
  title: string;
  description: string;
  buttonText: string;
  width: number;
  x: number;
  y: number;
}

const ProductCard: FC<ProductCardProps> = (props: ProductCardProps) => {
  const imageWidth = props.width;
  const imageHeight = props.width * 0.75; // Пропорциональная высота изображения

  // Определяем высоту текста для адаптации карточки
  const textHeight = 20 * 3; // Предполагаемая высота текста для трех строк

  // Высота карточки равна высоте изображения плюс высота текста и отступы
  const cardHeight = imageHeight + textHeight + 40;

  return (
    <Group x={props.x} y={props.y} width={props.width} height={cardHeight} draggable>
      {/* Фон карточки */}
      <Rect
        width={props.width}
        height={cardHeight}
        fill="#fafafa"
        stroke="#ccc"
        strokeWidth={1}
        cornerRadius={5}
      />

      {/* Изображение товара */}
      {/* <Image image={} width={imageWidth} height={imageHeight} /> */}

      {/* Заголовок */}
      <Text
        text={props.title}
        x={10}
        y={imageHeight + 10}
        fontSize={18}
        fontFamily="Arial"
        fill="#333"
        width={props.width - 20}
        align="center"
        fontStyle="bold"
        ellipsis={true}
      />

      {/* Текст описания */}
      <Text
        text={props.description}
        x={10}
        y={imageHeight + 40}
        fontSize={14}
        fontFamily="Arial"
        fill="#666"
        width={props.width - 20}
        align="left"
        lineHeight={1.2}
        ellipsis={true}
      />

      {/* Кнопка */}
      <Rect
        x={props.width / 2 - 50}
        y={cardHeight - 30}
        width={100}
        height={20}
        fill="#0077cc"
        cornerRadius={5}
      />
      <Text
        text={props.buttonText}
        x={props.width / 2 - 40}
        y={cardHeight - 27}
        fontSize={14}
        fontFamily="Arial"
        fill="#fff"
        width={80}
        align="center"
        fontStyle="bold"
        ellipsis={true}
      />
    </Group>
  );
};

export default ProductCard;