import Head from "next/head";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import Banner from "../components/banner";
import Card from "../components/card/card";
import useTrackLocation from "../hooks/use-track-location";
import { fetchCoffeeStores } from "../lib/coffee-store";
import { ACTION_TYPE, StoreContext } from "../store/store-context";
import styles from "../styles/Home.module.css";

export async function getStaticProps(context) {
  const coffeeStores = await fetchCoffeeStores();
  return {
    props: { coffeeStores },
    revalidate: 60,
  };
}

export default function Home(props) {
  const { hanleTrackLocation, locationErrorMsg, isFindingLocation } =
    useTrackLocation();
  const [coffeeStoresError, setCoffeeStoresError] = useState(null);

  const { dispatch, state } = useContext(StoreContext);
  const { coffeeStores, latLong } = state;

  useEffect(() => {
    async function setCoffeeStoresByLocation() {
      if (latLong) {
        try {
          const response = await fetch(
            `/api/getCoffeStoreByLocation?latLong=${latLong}&limit=16`
          );
          const result = await response.json();
          dispatch({
            type: ACTION_TYPE.SET_COFFEE_STORES,
            payload: {
              coffeeStores: result,
            },
          });
          setCoffeeStoresError("");
        } catch (error) {
          setCoffeeStoresError(error.message);
        }
      }
    }
    setCoffeeStoresByLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latLong]);
  const handleOnBannerClick = () => {
    hanleTrackLocation();
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Nextjs</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText={
            isFindingLocation ? (
              <div className={"circleLoading"}></div>
            ) : (
              "View stores nearby"
            )
          }
          handleOnClick={handleOnBannerClick}
        />
        {locationErrorMsg ? `Something went wrong: ${locationErrorMsg}` : ""}
        {coffeeStoresError ? `Something went wrong: ${coffeeStoresError}` : ""}
        <div className={styles.heroImage}>
          <Image
            src="/static/hero-image.png"
            alt="bg-cover"
            width={700}
            height={400}
          />
        </div>

        {coffeeStores.length > 0 && (
          <div className={styles.contentWrapper}>
            <h2 className={styles.heading2}>Stores near me</h2>
            <div className={styles.cardLayout}>
              {coffeeStores?.map((coffeeStore) => (
                <Card
                  key={coffeeStore.fsq_id}
                  name={coffeeStore.name}
                  imgUrl={
                    coffeeStore.imgUrl ||
                    "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                  }
                  href={`/coffee-store/${coffeeStore.fsq_id}`}
                  className={styles.card}
                />
              ))}
            </div>
          </div>
        )}

        {props.coffeeStores.length > 0 && (
          <div className={styles.contentWrapper}>
            <h2 className={styles.heading2}>New York stores</h2>
            <div className={styles.cardLayout}>
              {props.coffeeStores?.map((coffeeStore) => (
                <Card
                  key={coffeeStore.fsq_id}
                  name={coffeeStore.name}
                  imgUrl={
                    coffeeStore.imgUrl ||
                    "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                  }
                  href={`/coffee-store/${coffeeStore.fsq_id}`}
                  className={styles.card}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
