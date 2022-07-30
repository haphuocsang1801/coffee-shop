import Image from "next/image";
import Link from "next/link";
import styles from "./card.module.css";
import cls from "classnames";
const Card = (props) => {
  return (
    <Link href={props.href}>
      <a className={styles.cardLink}>
        <div className={cls(styles.container, "glass")}>
          <div className={styles.cardHeaderWrapper}>
            <h2 className={styles.cardHeader}>{props.name}</h2>
          </div>
          <div className={styles.cardImageWrapper}>
            <Image
              className={styles.cardImage}
              src={props.imgUrl}
              alt="coffee shop image"
              layout="fill"
            />
          </div>
        </div>
      </a>
    </Link>
  );
};
export default Card;
