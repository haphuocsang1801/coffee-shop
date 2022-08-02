import cls from "classnames";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { fetchCoffeeStores } from "../../lib/coffee-store";
import { StoreContext } from "../../store/store-context";
import styles from "../../styles/coffee-store.module.css";
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
  const id = router.query.id;
  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);
  const {
    state: { coffeeStores },
  } = useContext(StoreContext);

  const handleCreateCoffeeStore = async (coffeeStore) => {
    try {
      const { fsq_id, name, location, voting, related_places, imgUrl } =
        coffeeStore;
      const res = await fetch(`/api/createCoffeeStore`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: fsq_id,
          name,
          voting: voting || 0,
          location: location || "",
          related_places: related_places || "",
          imgUrl: imgUrl || "",
        }),
      });
      const dbCoffeeStore = await res.json();
    } catch (error) {
      console.error("Error creating coffee store");
    }
  };

  useEffect(() => {
    if (isEmpty(initialProps.coffeeStore)) {
      if (coffeeStores.length > 0) {
        const coffeeStoreFromContext = coffeeStores.find((store) => {
          return store.fsq_id.toString() === id;
        });
        if (coffeeStoreFromContext) {
          setCoffeeStore(coffeeStoreFromContext);
          handleCreateCoffeeStore(coffeeStoreFromContext);
        }
      }
    } else {
      handleCreateCoffeeStore(initialProps.coffeeStore);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, initialProps, initialProps.coffeeStore]);
  const [votingCount, setVotingCount] = useState(0);
  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, (url) =>
    fetch(url).then((res) => res.json())
  );
  useEffect(() => {
    if (data && data?.records?.length > 0) {
      setCoffeeStore(data.records[0]);
      setVotingCount(data.records[0].voting);
    }
  }, [data]);
  const handleUpdateButton = async () => {
    try {
      const res = await fetch(`/api/favouriteCoffeeStoreById`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });
      const dbCoffeeStore = await res.json();
      if (dbCoffeeStore) {
        setVotingCount((pre) => pre + 1);
      }
    } catch (error) {
      console.error("Error upvoting coffee store");
    }
  };
  if (
    router.isFallback ||
    !id ||
    isEmpty(coffeeStore) ||
    error ||
    !coffeeStore
  ) {
    return <div>Loading...</div>;
  }
  return (
    <div className={styles.layout}>
      <Head>
        <title>{coffeeStore?.name || ""}</title>
      </Head>
      <Link href="/">
        <a className={styles.backLink}>
          <span> ← Back to home</span>
        </a>
      </Link>
      <p className={styles.title}>{coffeeStore?.name || ""}</p>
      <div className={styles.containerMain}>
        <div className={styles.imageCoffee}>
          <Image
            src={coffeeStore?.imgUrl || ""}
            alt={coffeeStore?.name}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className={cls(styles.info, "glass")}>
          <div className={styles.iconWrapper}>
            <Image
              src="/icons/nearMe.svg"
              alt={coffeeStore?.name}
              width={24}
              height={24}
            />
            <span>
              {coffeeStore?.location.address ||
                coffeeStore?.location.country ||
                coffeeStore?.location ||
                ""}
            </span>
          </div>
          {coffeeStore?.related_places?.children && (
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
            <Image
              src="/icons/star.svg"
              alt={coffeeStore?.name}
              width={24}
              height={24}
            />
            <span>{votingCount}</span>
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
