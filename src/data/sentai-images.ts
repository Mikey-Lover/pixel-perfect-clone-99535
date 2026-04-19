import type { SentaiId } from "./sentais";
import rubroImg from "@/assets/sentai-rubro.png";
import douradoImg from "@/assets/sentai-dourado.png";
import esmeraldaImg from "@/assets/sentai-esmeralda.png";
import onixImg from "@/assets/sentai-onix.png";
import rosaImg from "@/assets/sentai-rosa.png";

export const SENTAI_IMAGES: Record<SentaiId, string> = {
  rubro: rubroImg,
  dourado: douradoImg,
  esmeralda: esmeraldaImg,
  onix: onixImg,
  rosa: rosaImg,
};
