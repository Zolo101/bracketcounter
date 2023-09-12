import Pocketbase from "pocketbase"

export const pb = new Pocketbase("https://cdn.zelo.dev")
export const bracketcounter = pb.collection("bracketcounter")
