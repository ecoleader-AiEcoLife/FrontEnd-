import axios from "axios";
import { useEffect, useState } from "react";
import EventMarker from "./EventMarker";

interface PositionProps {
  title: string;
  imgUrl: string;
  location: string;
  lat: number;
  lng: number;
}

const URL = "http://localhost:3001";

export default function Addmarkers() {
  const [positions, setPositions] = useState<PositionProps[]>([]);

  const getPositions = async () => {
    try {
      const response = await axios.get(`${URL}/map`);
      setPositions(response.data.marker);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPositions();
  }, []);

  useEffect(() => {
    console.log("Positions:", positions);
  }, [positions]);

  return (
    <>
      {positions.map((position, index) => (
        <EventMarker
          key={index}
          title={position.title}
          imgUrl={position.imgUrl}
          location={position.location}
          lat={position.lat}
          lng={position.lng}
        />
      ))}
    </>
  );
}
