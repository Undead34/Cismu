import React, { useState } from "react";
import { v4 as uuid } from "uuid"

import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsArrowUpShort, BsArrowDownShort } from "react-icons/bs"
import { MdDragIndicator } from "react-icons/md"
import "../../styles/Tables.css";

interface DataItem {
  index: number;
  liked: boolean;
  title: string;
  duration: number;
}

interface DataTableProps {
  data: DataItem[];
}

function sortData(data: DataItem[], field: string, address: "asc" | "desc") {
  // Utilizar el método sort para ordenar el arreglo según el campo y dirección especificados

  data.sort((a: any, b: any) => {
    if (address === "asc") {
      if (a[field] < b[field]) return -1;
      if (a[field] > b[field]) return 1;
    } else if (address === "desc") {
      if (a[field] > b[field]) return -1;
      if (a[field] < b[field]) return 1;
    }
    return 0;
  });

  // Retornar el nuevo arreglo ordenado
  return data;
}

function PlaylistTable({ data }: DataTableProps) {
  const [sortDataField, setSortDataField] = useState("none");
  const [sortAddress, setSortAddress] = useState<"asc" | "desc">("asc");

  let newData;

  if (sortDataField === "none") {
    newData = data;
  } else {
    newData = sortData([...data], sortDataField, sortAddress);
  }

  function handledSort(event: any) {
    const field = event.target.getAttribute("data-field");

    setSortDataField(field);
    setSortAddress(sortAddress === "asc" ? "desc" : "asc")
  }

  const ArrowShort = sortAddress === "asc" ? <BsArrowUpShort /> : <BsArrowDownShort />;


  const rows = newData.map((music) => {
    return (
      <div className="row" key={uuid()}>
        <div className="index" >{music.index}</div>
        <div className="liked" >{music.liked ? <AiFillHeart /> : <AiOutlineHeart />}</div>
        <div className="title" >{music.title}</div>
        <div className="duration" >{music.duration}</div>
        <div className="drag-indicator" ><MdDragIndicator /></div>
      </div>
    );
  });

  return (
    <div className="playlist-table">
      <div className="header">
        <div className="header-row">
          <div className="header-cell" data-field="index" >
            <span data-field="index" onClick={handledSort} style={{ display: "flex", width: "fit-content" }}># {sortDataField === "index" && ArrowShort}</span>
          </div>
          <div className="header-cell"  >
            <span data-field="liked" onClick={handledSort} style={{ display: "flex", width: "fit-content" }}>Favorite {sortDataField === "liked" && ArrowShort}</span>
          </div>
          <div className="header-cell"  >
            <span data-field="title" onClick={handledSort} style={{ display: "flex", width: "fit-content" }}>Title {sortDataField === "title" && ArrowShort}</span>
          </div>
          <div className="header-cell"  >
            <span data-field="duration" onClick={handledSort} style={{ display: "flex", width: "fit-content" }}>Duration {sortDataField === "duration" && ArrowShort}</span>
          </div>
        </div>
      </div>
      <div className="content">
        <div className="rows">{rows}</div>
      </div>
    </div>
  );
}

export default PlaylistTable;
