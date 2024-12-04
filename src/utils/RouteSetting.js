import HomePage from "pages/HomePage";
import KaraaGame from "pages/KaraaGame";
import RecipeGame from "pages/RecipeGame";
import { PrivacyPolicy } from "pages/static/PrivacyPolicy";
import { TermsOfService } from "pages/static/TermsOfService";
import SandBox from "pages/sandbox/SandBox";
import Mekuri from "pages/Mekuri";
import Tower from "pages/KaraageTower";
import Survivor from "pages/Survivor";


const Path = {
  home: "/",
  signup: "/signup",
  karaagame: "/karaagame",
  recipegame: "/recipegame",
  privacypolicy: "/privacypolicy",
  termsofuse: "/termsofuse",
  sandbox: "/sandbox",
  mekuri: "/mekuri",
  tower: "/tower",
  survivor: "/survivor"
};

export const RouteSetting = [
  {
    path: Path.home,
    component: <HomePage />,
  },
  {
    path: Path.karaagame,
    component: <KaraaGame />,
  },
  {
    path: Path.recipegame,
    component: <RecipeGame />,
  },
  {
    path: Path.privacypolicy,
    component: <PrivacyPolicy />,
  },
  {
    path: Path.termsofuse,
    component: <TermsOfService />,
  },
  {
    path: Path.sandbox,
    component: <SandBox />,
  },
  {path: Path.mekuri,
    component: <Mekuri />,
  },
   {path: Path.tower,
    component: <Tower />,
  },
   {path: Path.survivor,
    component: <Survivor />,
  },
];

export const RoutePath = {
  home: {
    path: Path.home,
    name: "KARAAGE AGAIN",
  },
  karaagame: {
    path: Path.karaagame,
    name: "からあゲーム",
  },
  recipegame: {
    path: Path.recipegame,
    name: "リストランテからあげ",
  },
  privacypolicy: {
    path: Path.privacypolicy,
    name: "プライバシーポリシー",
  },
  termsofuse: {
    path: Path.termsofuse,
    name: "利用規約",
  },
  sandbox: {
    path: Path.sandbox,
    name: "テストスペース",
  },
  mekuri: {
    path: Path.mekuri,
    name: "からあげめくり",
  },
  tower: {
    path: Path.tower,
    name: "からあげ積み増しタワー",
  },
  survivor: {
    path: Path.survivor,
    name: "からあげサバイバーズ",
  },
};
