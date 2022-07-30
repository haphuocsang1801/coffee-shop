import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../../styles/coffee-store.module.css";
import cls from "classnames";
import { fetchCoffeeStores } from "../../lib/coffee-store";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../store/store-context";
import { isEmpty } from "../../utils";
export async function getStaticProps({ params }) {
  const coffeStoreData = await fetchCoffeeStores();
  const findCoffeeStoreById = coffeStoreData.find((store) => {
    return store.fsq_id.toString() === params.id;
  });
  return {
    props: {
      coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
    },
  };
}
export async function getStaticPaths() {
  const coffeStoreData = await fetchCoffeeStores();
  const paths = coffeStoreData.map((coffeeStore) => {
    return {
      params: {
        id: coffeeStore.fsq_id.toString(),
      },
    };
  });
  return {
    paths,
    fallback: true,
  };
}

const CoffeeStore = (initialProps) => {
  const router = useRouter();
  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);
  const {
    state: { coffeeStores },
  } = useContext(StoreContext);

  const id = router.query.id;

  useEffect(() => {
    if (isEmpty(initialProps.coffeeStore)) {
      if (coffeeStores.length > 0) {
        const findCoffeeStoreById = coffeeStores.find((store) => {
          return store.fsq_id.toString() === id;
        });
        setCoffeeStore(findCoffeeStoreById);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  const handleUpdateButton = () => {};
  if (isEmpty(coffeeStore)) return <p>NotFiund</p>;

  const { location, name, related_places, imgUrl } = coffeeStore;
  if (router.isFallback) {
    return <div>loading...</div>;
  }
  return (
    <div className={styles.layout}>
      <Head>
        <title>{name || ""}</title>
      </Head>
      <Link href="/">
        <a className={styles.backLink}>
          <span> ← Back to home</span>
        </a>
      </Link>
      <p className={styles.title}>{name || ""}</p>
      <div className={styles.containerMain}>
        <div className={styles.imageCoffee}>
          <Image
            src={
              imgUrl ||
              "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            }
            alt={name}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className={cls(styles.info, "glass")}>
          <div className={styles.iconWrapper}>
            <Image src="/icons/nearMe.svg" alt={name} width={24} height={24} />
            <span>{location.address || location.country || ""}</span>
          </div>
          {related_places.children && (
            <div className={styles.iconWrapper}>
              <Image
                src="/icons/places.svg"
                alt={name}
                width={24}
                height={24}
              />
              <span>
                {related_places.children ? related_places.children[0].name : ""}
              </span>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image src="/icons/star.svg" alt={name} width={24} height={24} />
            <span>6</span>
          </div>
          <button onClick={handleUpdateButton} className={styles.button}>
            Up vote
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;
