"use client";

import Addmarkers from "@/components/maps/Addmarkets";
import { useState, useEffect } from "react";
import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";

const API_KEY = process.env.NEXT_PUBLIC_KAKAO_API_KEY;

export default function map() {
  const [state, setState] = useState({
    center: {
      lat: 35.8888,
      lng: 128.6103,
    },
    errMsg: null,
    isLoading: true,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      // GeoLocation을 이용해서 접속 위치를 얻어옴
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setState((prev) => ({
            ...prev,
            center: {
              lat: position.coords.latitude, // 위도
              lng: position.coords.longitude, // 경도
            },
            isLoading: false,
          }));
        },
        (err) => {
          setState((prev: any) => ({
            ...prev,
            errMsg: err.message,
            isLoading: false,
          }));
        }
      );
    } else {
      // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정함
      setState((prev: any) => ({
        ...prev,
        errMsg: "geolocation을 사용할수 없습니다.",
        isLoading: false,
      }));
    }
  }, []);

  const [loading, error] = useKakaoLoader({
    appkey: API_KEY as string,
  });

  // 지도의 중심좌표

  return (
    // Map 내부에서 loading 상태를 관찰하고 있기 때문에 conditional rendering를 하지 않아도 됌
    <div className=" w-full min-h-screen flex flex-col justify-center items-center">
      <div className="bg-green-100 p-2 rounded-md font-bold mb-3">
        재활용 쓰레기통 위치 지도
      </div>
      <div className="w-full max-w-[88vw] h-[60vh] md:h-[70vh] lg:h-[80vh]">
        <Map // 지도를 표시할 Container
          center={state.center}
          style={{
            // 지도의 크기
            width: "100%",
            height: "100%",
          }}
          level={3} // 지도의 확대 레벨
        >
          <Addmarkers />

          {!state.isLoading && (
            <MapMarker
              position={state.center}
              infoWindowOptions={{
                disableAutoPan: true,
                removable: true,
                zIndex: 1,
              }}
            >
              <div className="whitespace-nowrap px-2.5 py-1.5 pr-1">
                {state.errMsg ? state.errMsg : "현재 위치"}
              </div>
            </MapMarker>
          )}
        </Map>
      </div>
      <div className="bg-violet-100 p-4 m-8 rounded-md  ">
        <span className="font-bold">
          재활용 쓰레기통의 위치를 추가 해주세요! ( 야외인 경우 상세 주소만
          적어주세요 )
        </span>
        <form className="flex gap-5">
          <input
            className="bg-slate-100 pl-2"
            type="text"
            placeholder="건물 번호"
          ></input>
          <input
            className="bg-slate-100 pl-2"
            type="text"
            placeholder="상세 주소"
          ></input>
          <button className="bg-red-600 rounded-md p-1 text-white">전송</button>
        </form>
      </div>
    </div>
  );
}
