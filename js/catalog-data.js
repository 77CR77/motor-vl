// ===== МОТОР-ВЛ: данные каталога (УСТАРЕЛО) =====
// Этот файл больше не подключается на сайте — начиная с введения админ-панели
// каталог хранится в data/motors.json и data/brands.json, а catalog.js
// загружает его через fetch(). Файл оставлен только как архивная копия
// исходных данных на случай, если понадобится сверка.

var MOTORS = [
  // ---------- YAMAHA ----------
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F25 (S), румпель (1043580)",
    price: 220000, badge: "Хит продаж",
    img: "/media/38/images/thumb/91M0tfSx.png",
    photos: ["/media/38/images/thumb/91M0tfSx.png", "/media/38/images/thumb/NL5FgBQw.png", "/media/38/images/thumb/xGo7FON6.png", "/media/38/images/thumb/q0U2aXwR.png", "/media/38/images/thumb/UVZChXj9.png", "/media/38/images/thumb/wm4I3TWl.png"],
    videos: ["Запуск двигателя", "Компрессия 1 цилиндр", "Компрессия 2 цилиндр", "Давление масла"],
    specs: [
      ["Год", "2008"], ["Тактность", "4-х тактный"], ["Кол-во цилиндров", "2"],
      ["Система подъема мотора", "ручная"], ["Длина ноги", "S (381 мм)"],
      ["Управление", "румпель"], ["Компрессия", "14/14"], ["Два стартера", "электрический и ручной"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F25 (S), гидравлика, пульт управления (1042495)",
    price: 250000,
    img: "/media/37/images/thumb/eFiTTmsZ.png",
    photos: ["/media/37/images/thumb/8JSYt5Pn.png", "/media/37/images/thumb/eFiTTmsZ.png", "/media/37/images/thumb/qgXTODQQ.png", "/media/37/images/thumb/ITF5Bfbl.png", "/media/37/images/thumb/boD9QQwa.png", "/media/37/images/thumb/7Eh13tpt.png", "/media/37/images/thumb/yzYtUdxn.png"],
    videos: ["Запуск двигателя", "Компрессия 1 цилиндр", "Компрессия 2 цилиндр", "Давление масла", "Проверка гидроподъема"],
    specs: [
      ["Год", "2008"], ["Тактность", "4-х тактный"], ["Кол-во цилиндров", "2"],
      ["Подъем", "гидравлический"], ["Длина ноги", "S (381 мм)"],
      ["Компрессия", "15/15"], ["Управление", "дистанционное"], ["Комплектация", "продаётся с машинкой"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F25 (S), румпель, гидродемпфер (1039199)",
    price: 270000,
    img: "/media/73/images/thumb/ITVB1rfv.jpeg",
    photos: ["/media/73/images/thumb/PB1JFY2Y.jpeg", "/media/73/images/thumb/ITVB1rfv.jpeg", "/media/73/images/thumb/TPC5NvdW.jpeg", "/media/73/images/thumb/9tcFQ6Cb.jpeg", "/media/73/images/thumb/zk5RLSYR.jpeg", "/media/73/images/thumb/dkagpBV0.jpeg", "/media/73/images/thumb/ctkPEYxp.jpeg"],
    videos: ["Запуск двигателя", "Компрессия 1 цилиндр", "Давление масла", "Проверка гидродемпфера"],
    specs: [
      ["Год", "2019"], ["Тактность", "4-тактный"], ["Кол-во цилиндров", "2"],
      ["Система подъема мотора", "ручная (гидродемпфер)"], ["Длина ноги", "S (381 мм)"],
      ["Управление", "румпель"], ["Компрессия", "15/15"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F25 (S), гидроподъем, пульт управления (1033771)",
    price: 340000,
    img: "/media/76/images/thumb/nvJaBjdE.jpeg",
    photos: ["/media/76/images/thumb/nvJaBjdE.jpeg", "/media/76/images/thumb/MLmvNjfv.jpeg", "/media/76/images/thumb/vodM0xLN.jpeg", "/media/76/images/thumb/jTaatH_q.jpeg", "/media/76/images/thumb/WBtDY-Ap.jpeg"],
    videos: ["Запуск двигателя", "Запуск с кикстартера", "Компрессия 1 цилиндр", "Компрессия 2 цилиндр", "Давление масла", "Проверка гидроподъема"],
    specs: [
      ["Год", "2018"], ["Тактность", "4-тактный"], ["Кол-во цилиндров", "2"],
      ["Управление", "дистанционное"], ["Подъем", "гидравлический"], ["Длина ноги", "S (381 мм)"],
      ["Компрессия", "15/15"], ["Два стартера", "электрический и ручной"], ["Комплектация", "продаётся с машинкой"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F60 (L), гидравлика, пульт управления (1044089)",
    price: 370000,
    img: "/media/103/images/thumb/3gOvJDFx.jpeg",
    photos: ["/media/103/images/thumb/3gOvJDFx.jpeg", "/media/103/images/thumb/VLSJ9xwx.jpeg", "/media/103/images/thumb/GsK1s5yC.jpeg", "/media/103/images/thumb/ZusLWNSN.jpeg", "/media/103/images/thumb/2_kdeoFT.jpeg", "/media/103/images/thumb/LwnL8PjJ.jpeg"],
    videos: ["Запуск двигателя", "Компрессия 1 цилиндр", "Компрессия 2 цилиндр", "Компрессия 3 цилиндр", "Компрессия 4 цилиндр", "Проверка гидроподъема", "Синхронизация карбюраторов", "Давление масла"],
    specs: [
      ["Год", "2008"], ["Тактность", "4-х тактный"], ["Кол-во цилиндров", "4"],
      ["Подъем", "гидравлический"], ["Длина ноги", "L (508 мм)"],
      ["Управление", "дистанционное"], ["Компрессия", "16/16/16/16"], ["Комплектация", "продаётся с пультом управления"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F25 EFI (L), гидродемпфер (1073672)",
    price: 390000,
    img: "/media/30/images/thumb/QsLNLtS8.jpeg",
    photos: ["/media/30/images/thumb/QsLNLtS8.jpeg", "/media/30/images/thumb/d1naO_FW.jpeg", "/media/30/images/thumb/ExTrghNu.jpeg", "/media/30/images/thumb/sBJg63Nn.jpeg", "/media/30/images/thumb/x4jJFkro.jpeg", "/media/30/images/thumb/bw9XAi5L.jpeg", "/media/30/images/thumb/dKVDh7_l.jpeg"],
    videos: ["Запуск двигателя", "Компрессия 1 цилиндр", "Компрессия 2 цилиндр", "Давление масла", "Проверка гидродемпфера"],
    specs: [
      ["Год", "2023"], ["Тактность", "4-х тактный"], ["Кол-во цилиндров", "3"],
      ["Длина ноги", "L (508 мм)"], ["Особенность", "можно переделать в ногу S"], ["Компрессия", "14/14"],
      ["Два стартера", "электрический и ручной"], ["Наработка", "50 моточасов"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F80 (L), гидравлика, пульт управления (1096286)",
    price: 430000,
    img: "/media/51/images/thumb/l4JxVrAF.jpeg",
    photos: ["/media/51/images/thumb/l4JxVrAF.jpeg", "/media/51/images/thumb/6SArzevC.jpeg", "/media/51/images/thumb/WRFt4lsR.jpeg", "/media/51/images/thumb/V3QwMquR.jpeg", "/media/51/images/thumb/SSF5i5BH.jpeg", "/media/51/images/thumb/LsaHmLWN.jpeg"],
    videos: ["Запуск двигателя", "Компрессия 1 цилиндр", "Компрессия 2 цилиндр", "Компрессия 3 цилиндр", "Компрессия 4 цилиндр", "Давление масла", "Проверка гидроподъема"],
    specs: [
      ["Год", "2008"], ["Тактность", "4-х тактный"], ["Кол-во цилиндров", "4"],
      ["Система подъема мотора", "гидравлическая"], ["Длина ноги", "L (508 мм)"],
      ["Компрессия", "15/15/15/15"], ["Давление масла", "5 кг"], ["Комплектация", "продаётся с пультом управления"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F30 EFI (L) пульт управления (1070478)",
    price: 450000,
    img: "/media/63/images/thumb/QLWd18se.jpeg",
    photos: ["/media/63/images/thumb/QLWd18se.jpeg", "/media/63/images/thumb/4y98zDWZ.jpeg", "/media/63/images/thumb/fdOa4-At.jpeg", "/media/63/images/thumb/SX5DL9BD.jpeg", "/media/63/images/thumb/oZyKnyuk.jpeg", "/media/63/images/thumb/Ew-vqXdg.jpeg"],
    videos: ["Запуск двигателя", "Компрессия 1 цилиндр", "Компрессия 2 цилиндр", "Компрессия 3 цилиндр", "Давление масла", "Проверка гидроподъема"],
    specs: [
      ["Год", "2017"], ["Тактность", "4-х тактный"], ["Кол-во цилиндров", "3"],
      ["Система подъема мотора", "гидравлическая"], ["Длина ноги", "L (508 мм)"],
      ["Компрессия", "15/15/15"], ["Наработка", "415 моточасов"], ["Комплектация", "продаётся с машинкой"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F60 EFI (L), гидравлика, пульт управления (1053686)",
    price: 450000,
    img: "/media/89/images/thumb/fzsa4oKt.jpeg",
    photos: ["/media/89/images/thumb/DPLY7FHc.jpeg", "/media/89/images/thumb/fzsa4oKt.jpeg", "/media/89/images/thumb/0bYtQGvh.jpeg", "/media/89/images/thumb/gRxr2Wko.jpeg", "/media/89/images/thumb/QP_Gl09s.jpeg", "/media/89/images/thumb/7E7l8DsW.jpeg"],
    videos: ["Запуск двигателя", "Компрессия 1 цилиндр", "Компрессия 2 цилиндр", "Компрессия 3 цилиндр", "Компрессия 4 цилиндр", "Давление масла", "Проверка гидроподъема"],
    specs: [
      ["Год", "2012"], ["Система подъема мотора", "гидравлика"], ["Длина ноги", "L (508 мм)"],
      ["Состояние", "протестирован, компрессия 15/15/15/15 кг, состояние хорошее"],
      ["Управление", "дистанционное"], ["Наработка", "825 моточасов"],
      ["Комплектация", "продаётся с пультом управления (можно установить мультирумпель)"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F30 EFI (S), гидравлика, машинка (1016399)",
    price: 460000,
    img: "/media/26/images/thumb/otp8Jy52.png",
    photos: ["/media/26/images/thumb/B2h8_kya.png", "/media/26/images/thumb/FGoFIQy5.png", "/media/26/images/thumb/otp8Jy52.png", "/media/26/images/thumb/CU-yDPGT.png", "/media/26/images/thumb/MxNEX6Oq.png", "/media/26/images/thumb/ZbQFIn8a.png"],
    videos: ["Запуск двигателя", "Проверка гидроподъема", "Компрессия 1 цилиндр", "Компрессия 2 цилиндр", "Компрессия 3 цилиндр", "Давление масла"],
    specs: [
      ["Год", "2017"], ["Тактность", "4-х тактный"], ["Кол-во цилиндров", "3"],
      ["Система подъема мотора", "гидравлическая"], ["Длина ноги", "S (381 мм)"],
      ["Управление", "дистанционное"], ["Наработка", "682 моточаса"], ["Компрессия", "15/15/15"],
      ["Комплектация", "продаётся с машинкой"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F30 EFI (S), гидродемпфер, пульт управления (1001729)",
    price: 470000,
    img: "/media/75/images/thumb/mm0qBOBG.png",
    photos: ["/media/75/images/thumb/_0O4RsRi.png", "/media/75/images/thumb/mm0qBOBG.png", "/media/75/images/thumb/czEcH0ik.png", "/media/75/images/thumb/3ZFcUQKn.png", "/media/75/images/thumb/0_tgvSik.png", "/media/75/images/thumb/cZFbdBqO.png"],
    videos: ["Запуск двигателя", "Компрессия 2 цилиндр", "Давление масла", "Проверка гидродемпфера"],
    specs: [
      ["Год", "2018"], ["Тактность", "4-х тактный"], ["Кол-во цилиндров", "3"],
      ["Компрессия", "15/15/15"], ["Система подъема мотора", "ручная (гидродемпфер)"],
      ["Управление", "дистанционное"], ["Длина ноги", "S (381 мм)"], ["Наработка", "459 моточасов"],
      ["Комплектация", "продаётся с машинкой"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F90 EFI (L), гидравлика (1050413)",
    price: 490000,
    img: "/media/86/images/thumb/8T3_y5g5.jpeg",
    photos: ["/media/86/images/thumb/fLH_j2qb.jpeg", "/media/86/images/thumb/8T3_y5g5.jpeg", "/media/86/images/thumb/CYeTI7f9.jpeg", "/media/86/images/thumb/fli9orwE.jpeg", "/media/86/images/thumb/S694YR3u.jpeg", "/media/86/images/thumb/jdePv6w-.jpeg", "/media/86/images/thumb/PxotFl6q.jpeg"],
    videos: ["Запуск двигателя", "Компрессия 1 цилиндр", "Компрессия 2 цилиндр", "Компрессия 3 цилиндр", "Компрессия 4 цилиндр", "Давление масла", "Проверка гидроподъема"],
    specs: [
      ["Год", "2012"], ["Тактность", "4-х тактный"], ["Длина ноги", "L (508 мм)"],
      ["Управление", "дистанционное"], ["Подъем", "гидравлический"],
      ["Компрессия", "16/16/16/16"], ["Наработка", "795 моточасов"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F90 EFI (L), гидравлика (1050195)",
    price: 490000,
    img: "/media/88/images/thumb/8IZE9Pej.jpeg",
    photos: ["/media/88/images/thumb/8IZE9Pej.jpeg", "/media/88/images/thumb/dHVNa575.jpeg", "/media/88/images/thumb/oRgC37Mn.jpeg", "/media/88/images/thumb/Z8f-MiQf.jpeg", "/media/88/images/thumb/LsAzkI5g.jpeg", "/media/88/images/thumb/W8o2zAeg.jpeg"],
    videos: ["Запуск двигателя", "Компрессия 1 цилиндр", "Компрессия 2 цилиндр", "Компрессия 3 цилиндр", "Компрессия 4 цилиндр", "Давление масла", "Проверка гидроподъема"],
    specs: [
      ["Год", "2011"], ["Тактность", "4-х тактный"], ["Кол-во цилиндров", "4"],
      ["Система подъема мотора", "гидравлическая"], ["Компрессия", "16/16/16/16"],
      ["Нога", "L (508 мм)"], ["Управление", "дистанционное"], ["Наработка", "675 моточасов"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F40 EFI (S) гидроподъем, пульт управления (1002997)",
    price: 490000,
    img: "/media/92/images/thumb/WY6L_aO4.jpeg",
    photos: ["/media/92/images/thumb/WY6L_aO4.jpeg", "/media/92/images/thumb/SFkm6eTO.jpeg", "/media/92/images/thumb/teu_puF1.jpeg", "/media/92/images/thumb/WnkYRVBi.jpeg", "/media/92/images/thumb/GlBYrbd7.jpeg"],
    videos: ["Запуск двигателя", "Компрессия 1 цилиндр", "Компрессия 2 цилиндр", "Компрессия 3 цилиндр", "Давление масла", "Проверка гидроподъема"],
    specs: [
      ["Год", "2019"], ["Тактность", "4-х тактный"], ["Длина ноги", "S (381 мм)"],
      ["Управление", "дистанционное"], ["Подъем", "гидравлический"],
      ["Компрессия", "15/15/15"], ["Наработка", "559 моточасов"], ["Комплектация", "продаётся с машинкой"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F40 EFI (S), гидравлика, пульт управления (1002954)",
    price: 500000,
    img: "/media/24/images/thumb/t7dr0J99.jpeg",
    photos: ["/media/24/images/thumb/nWlwVVUj.jpeg", "/media/24/images/thumb/k67KbXY9.jpeg", "/media/24/images/thumb/t7dr0J99.jpeg", "/media/24/images/thumb/fh1r5Fts.jpeg", "/media/24/images/thumb/78xYk4JP.jpeg", "/media/24/images/thumb/FavvhSk9.jpeg", "/media/24/images/thumb/kKXTyqn_.jpeg"],
    videos: ["Запуск двигателя", "Компрессия 1 цилиндр", "Компрессия 2 цилиндр", "Компрессия 3 цилиндр", "Проверка гидроподъема", "Давление масла"],
    specs: [
      ["Год", "2019"], ["Тактность", "4-х тактный"], ["Кол-во цилиндров", "3"],
      ["Длина ноги", "S (381 мм)"], ["Управление", "дистанционное"], ["Подъем", "гидравлический"],
      ["Компрессия", "15/15/15"], ["Наработка", "220 моточасов"], ["Комплектация", "продаётся с пультом управления"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F115 (X), гидравлика, пульт управления (1114470)",
    price: 590000,
    img: "/media/94/images/thumb/1ByXI8QA.png",
    photos: ["/media/94/images/thumb/YSFki7wr.png", "/media/94/images/thumb/AuaqCf3_.png", "/media/94/images/thumb/1ByXI8QA.png", "/media/94/images/thumb/1yCCKMOg.png", "/media/94/images/thumb/0NIPVyvj.png", "/media/94/images/thumb/M4HeQw0r.png", "/media/94/images/thumb/WA9ngECH.png"],
    videos: ["Запуск двигателя", "Компрессия 1 цилиндр", "Компрессия 2 цилиндр", "Компрессия 3 цилиндр", "Компрессия 4 цилиндр", "Давление масла", "Проверка гидроподъема", "Компьютерная диагностика"],
    specs: [
      ["Год", "2010"], ["Тактность", "4-х тактный"], ["Система подъема мотора", "гидравлическая"],
      ["Длина ноги", "X (635 мм)"], ["Управление", "дистанционное"], ["Компрессия", "16/16/16/16"],
      ["Наработка", "285 моточасов"], ["Комплектация", "продаётся с машинкой"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F115 EFI (X) (1151611)",
    price: 620000,
    img: "/media/79/images/thumb/DVVOYJUF.png",
    photos: ["/media/79/images/thumb/Kk01oH47.png", "/media/79/images/thumb/DVVOYJUF.png", "/media/79/images/thumb/eFCWHiAE.png", "/media/79/images/thumb/DJi2HvAY.png", "/media/79/images/thumb/TQenVBPM.png", "/media/79/images/thumb/rGpBYLy0.png", "/media/79/images/thumb/y6obgPO-.png"],
    videos: ["Запуск двигателя", "Компрессия 1 цилиндр", "Компрессия 3 цилиндр", "Компрессия 4 цилиндр", "Давление масла", "Проверка гидроподъема", "Компьютерная диагностика"],
    specs: [
      ["Год", "2013"], ["Тактность", "4-х тактный"], ["Кол-во цилиндров", "4"],
      ["Система подъема мотора", "гидравлическая"], ["Длина ноги", "X (635 мм)"],
      ["Компрессия", "16/16/16/16"], ["Управление", "дистанционное"], ["Наработка", "499 моточасов"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F90 EFI (L), гидравлика, пульт управления (1084298)",
    price: 650000,
    img: "/media/50/images/thumb/A3_1DHjZ.png",
    photos: ["/media/50/images/thumb/C20Tm5jj.png", "/media/50/images/thumb/A3_1DHjZ.png", "/media/50/images/thumb/PWTUxUzy.png", "/media/50/images/thumb/rkGkaoLy.png", "/media/50/images/thumb/RUJErih6.png", "/media/50/images/thumb/EIF-GwvU.png", "/media/50/images/thumb/r-JyXJ1_.png"],
    videos: ["Запуск двигателя", "Компрессия 1 цилиндр", "Компрессия 2 цилиндр", "Компрессия 3 цилиндр", "Компрессия 4 цилиндр", "Давление масла", "Проверка гидроподъема"],
    specs: [
      ["Год", "2016"], ["Тактность", "4-х тактный"], ["Система подъема мотора", "гидравлическая"],
      ["Длина ноги", "L (508 мм)"], ["Компрессия", "16/16/16/16"], ["Управление", "дистанционное"],
      ["Наработка", "812 моточасов"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F40 EFI (L) НОВЫЙ МОТОР ИЗ ЯПОНИИ",
    price: 670000, badge: "Новый",
    img: "/media/100/images/thumb/Mqq3VMFq.jpeg",
    photos: ["/media/100/images/thumb/Mqq3VMFq.jpeg", "/media/100/images/thumb/sZ1GNIX7.jpeg", "/media/100/images/thumb/TXZIBA22.jpeg"],
    videos: [],
    specs: [
      ["Год", "2024"], ["Тактность", "4-тактный"], ["Кол-во цилиндров", "3"],
      ["Система подъема мотора", "гидравлическая"], ["Длина ноги", "L (508 мм)"],
      ["Комплектация", "мультирумпель, топливный бак, шланг в комплекте"],
      ["Особенность", "можно установить машинку дистанционного управления, есть возможность установить ногу S"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "НОВЫЙ ЛОДОЧНЫЙ МОТОР Yamaha F60 EFI (L)",
    price: 720000, badge: "Новый",
    img: "/media/49/images/thumb/huTnmVc0.jpeg",
    photos: ["/media/49/images/thumb/huTnmVc0.jpeg", "/media/49/images/thumb/hzuWDf9y.jpeg", "/media/49/images/thumb/W4-2hGjj.jpeg"],
    videos: [],
    specs: [
      ["Год", "2025"], ["Тактность", "4-х тактный"], ["Кол-во цилиндров", "4"],
      ["Система подъема мотора", "гидравлическая"], ["Длина ноги", "L (508 мм)"], ["Управление", "дистанционное"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F130 EFI (X) (1008122)",
    price: 780000,
    img: "/media/62/images/thumb/XwPbk3kn.jpeg",
    photos: ["/media/62/images/thumb/XwPbk3kn.jpeg", "/media/62/images/thumb/iQjqPztO.jpeg", "/media/62/images/thumb/M_r-nLW7.jpeg", "/media/62/images/thumb/9ct11lTv.jpeg", "/media/62/images/thumb/pH6JT1PW.jpeg", "/media/62/images/thumb/pemiFM_r.jpeg", "/media/62/images/thumb/vF69vC-T.jpeg"],
    videos: ["Запуск двигателя", "Компрессия 1 цилиндр", "Компрессия 2 цилиндр", "Компрессия 3 цилиндр", "Компрессия 4 цилиндр", "Давление масла", "Проверка гидроподъема"],
    specs: [
      ["Год", "2019"], ["Тактность", "4-тактный"], ["Кол-во цилиндров", "4"],
      ["Система подъема мотора", "гидравлическая"], ["Длина ноги", "X (635 мм)"],
      ["Управление", "дистанционное"], ["Компрессия", "15/15/15/15"], ["Наработка", "372 моточаса"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F150 (X) (1152107)",
    price: 790000,
    img: "/media/29/images/thumb/i3tK8dO1.jpeg",
    photos: ["/media/29/images/thumb/biS_nPUK.jpeg", "/media/29/images/thumb/i3tK8dO1.jpeg", "/media/29/images/thumb/q5nUbxFU.jpeg", "/media/29/images/thumb/IQH1VLJV.jpeg", "/media/29/images/thumb/ZN8n53D-.jpeg", "/media/29/images/thumb/OcwmbHAW.jpeg", "/media/29/images/thumb/PQY_nb1c.jpeg", "/media/29/images/thumb/tibJEc99.jpeg"],
    videos: ["Запуск двигателя", "Компрессия 1 цилиндр", "Компрессия 2 цилиндр", "Компрессия 3 цилиндр", "Компрессия 4 цилиндр", "Проверка гидроподъема", "Компьютерная диагностика"],
    specs: [
      ["Год", "2014"], ["Тактность", "4-х тактный"], ["Система подъема мотора", "гидравлическая"],
      ["Длина ноги", "X (635мм)"], ["Управление", "дистанционное"], ["Наработка", "975 моточасов"],
      ["Особенность", "привезён из Японии, в России не эксплуатировался"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F200 (X), гидравлика (1012892)",
    price: 790000,
    img: "/media/90/images/thumb/wa5wWMJr.jpeg",
    photos: ["/media/90/images/thumb/IPKK5Wbs.jpeg", "/media/90/images/thumb/wa5wWMJr.jpeg", "/media/90/images/thumb/-n8bpxdq.jpeg", "/media/90/images/thumb/pt61WCHc.jpeg", "/media/90/images/thumb/XpY4-RxK.jpeg", "/media/90/images/thumb/m5-pfYZk.jpeg"],
    videos: ["Запуск двигателя", "Компрессия 1 цилиндр", "Компрессия 2 цилиндр", "Компрессия 3 цилиндр", "Компрессия 4 цилиндр", "Компрессия 5 цилиндр", "Компрессия 6 цилиндр", "Проверка гидроподъема", "Давление масла и компьютерная диагностика"],
    specs: [
      ["Год", "2010"], ["Тактность", "4-тактный"], ["Система подъема мотора", "гидравлическая"],
      ["Длина ноги", "X (635 мм)"], ["Управление", "дистанционное"], ["Наработка", "857 моточаса"],
      ["Компрессия", "14/14/14/14/14/14"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F150 (L), гидравлика (1152924)",
    price: 850000,
    img: "/media/25/images/thumb/pgWrcYVa.jpeg",
    photos: ["/media/25/images/thumb/gO3jH7GI.jpeg", "/media/25/images/thumb/RuaidQJZ.jpeg", "/media/25/images/thumb/pgWrcYVa.jpeg", "/media/25/images/thumb/FNJV8AuM.jpeg", "/media/25/images/thumb/ohKOpm9X.jpeg"],
    videos: ["Запуск двигателя", "Компрессия 1 цилиндр", "Компрессия 2 цилиндр", "Компрессия 3 цилиндр", "Компрессия 4 цилиндр", "Компьютерная диагностика и давление масла", "Проверка гидроподъема"],
    specs: [
      ["Год", "2014"], ["Длина ноги", "L (508 мм)"], ["Управление", "дистанционное"],
      ["Подъем", "гидравлический"], ["Компрессия", "15/15/15/15"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F150 (L), гидравлика (1152947)",
    price: 850000,
    img: "/media/48/images/thumb/YEaQXb09.png",
    photos: ["/media/48/images/thumb/4Pdmt80Q.png", "/media/48/images/thumb/YEaQXb09.png", "/media/48/images/thumb/n-g2U3FJ.png", "/media/48/images/thumb/zLHKKOQS.png", "/media/48/images/thumb/beGV8HUu.png", "/media/48/images/thumb/j2FsCY8w.png", "/media/48/images/thumb/fqy5kjNd.png", "/media/48/images/thumb/zrFlB93B.png"],
    videos: ["Компрессия 1 цилиндр", "Запуск двигателя", "Компрессия 2 цилиндр", "Компрессия 3 цилиндр", "Компрессия 4 цилиндр", "Проверка гидроподъема", "Компьютерная диагностика"],
    specs: [
      ["Год", "2014"], ["Тактность", "4-х тактный"], ["Кол-во цилиндров", "4"],
      ["Система подъема мотора", "гидравлическая"], ["Длина ноги", "L (508 мм)"],
      ["Управление", "дистанционное"], ["Наработка", "587 м/ч"], ["Компрессия", "16/16/16/16"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "НОВЫЙ МОТОР Yamaha F90 EFI (L)",
    price: 1050000, badge: "Новый",
    img: "/media/95/images/thumb/od5CRLE4.jpeg",
    photos: ["/media/95/images/thumb/od5CRLE4.jpeg", "/media/95/images/thumb/nMExjmCK.jpeg", "/media/95/images/thumb/FtIfgHyf.jpeg", "/media/95/images/thumb/dV4g-nPp.jpeg", "/media/95/images/thumb/0F1LGSAl.jpeg", "/media/95/images/thumb/Brue97uM.jpeg"],
    videos: [],
    specs: [
      ["Состояние", "новый лодочный мотор, из японского дилерского центра"], ["Тактность", "4-х тактный"],
      ["Длина ноги", "L (508 мм)"], ["Управление", "дистанционное"], ["Наработка", "0 моточасов"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "НОВЫЙ МОТОР Yamaha F150 EFI (X)",
    price: 1350000, badge: "Новый",
    img: "/media/93/images/thumb/ukHSOg8C.jpeg",
    photos: ["/media/93/images/thumb/ukHSOg8C.jpeg", "/media/93/images/thumb/W6N9-tcw.jpeg", "/media/93/images/thumb/GfqWbKIb.jpeg", "/media/93/images/thumb/WxzRzfCd.jpeg", "/media/93/images/thumb/itSeoDr6.jpeg"],
    videos: [],
    specs: [
      ["Год", "2023"], ["Тактность", "4-х тактный"], ["Длина ноги", "X (635 мм)"],
      ["Подъем", "гидравлический"], ["Управление", "дистанционное"], ["Винт", "из нержавейки"]
    ]
  },

  // ---------- HONDA ----------
  {
    brand: "honda", brandLabel: "Honda",
    title: "Honda BF75 (L), гидравлика, пульт управления (1200313)",
    price: 520000,
    img: "/media/34/images/thumb/rehurjC1.jpeg",
    photos: ["/media/34/images/thumb/TieC9A6M.jpeg", "/media/34/images/thumb/rehurjC1.jpeg", "/media/34/images/thumb/xrknrN-J.jpeg", "/media/34/images/thumb/8I9zzaBC.jpeg", "/media/34/images/thumb/560Evi8H.jpeg", "/media/34/images/thumb/FBzKnTS_.jpeg"],
    videos: ["Запуск двигателя", "Компрессия 1 цилиндр", "Компрессия 2 цилиндр", "Компрессия 4 цилиндр", "Проверка гидроподъема", "Давление масла", "Компрессия 3 цилиндр"],
    specs: [
      ["Год", "2015"], ["Тактность", "4-х тактный"], ["Кол-во цилиндров", "4"],
      ["Система подъема мотора", "гидравлическая"], ["Длина ноги", "L (508 мм)"],
      ["Управление", "дистанционное"], ["Компрессия", "16/16/16/16"], ["Комплектация", "продаётся с машинкой"]
    ]
  },
  {
    brand: "honda", brandLabel: "Honda",
    title: "Honda BF75 EFI (L), гидравлика, пульт управления (1206547)",
    price: 550000,
    img: "/media/33/images/thumb/y3WrhUIp.jpeg",
    photos: ["/media/33/images/thumb/4EnJHVKv.jpeg", "/media/33/images/thumb/Je8T6CPX.jpeg", "/media/33/images/thumb/y3WrhUIp.jpeg", "/media/33/images/thumb/tfFIAF1M.jpeg", "/media/33/images/thumb/UplLB9p2.jpeg", "/media/33/images/thumb/VsMuyaO5.jpeg"],
    videos: ["Запуск двигателя", "Компрессия 1 цилиндр", "Компрессия 2 цилиндр", "Компрессия 3 цилиндр", "Компрессия 4 цилиндр", "Проверка генератора", "Давление масла", "Проверка гидроподъема"],
    specs: [
      ["Год", "2017"], ["Тактность", "4-тактный"], ["Кол-во цилиндров", "4"],
      ["Система подъема мотора", "гидравлическая"], ["Длина ноги", "L (508 мм)"],
      ["Управление", "дистанционное"], ["Компрессия", "16/16/16/16"], ["Комплектация", "продаётся с машинкой"]
    ]
  },
  {
    brand: "honda", brandLabel: "Honda",
    title: "НОВЫЙ ЛОДОЧНЫЙ МОТОР ИЗ ЯПОНИИ Honda BF50",
    price: 680000, badge: "Новый",
    img: "/media/70/images/thumb/DyKbxOyV.png",
    photos: ["/media/70/images/thumb/dpxi8r6v.png", "/media/70/images/thumb/DyKbxOyV.png", "/media/70/images/thumb/4B2YLQiT.png"],
    videos: [],
    specs: [
      ["Год", "2026"], ["Тактность", "4-тактный"], ["Длина ноги", "L (508 мм)"], ["Управление", "дистанционное"]
    ]
  },

  // ---------- SUZUKI ----------
  {
    brand: "suzuki", brandLabel: "Suzuki",
    title: "Suzuki DF30 EFI (S), гидродемпфер (911065)",
    price: 390000,
    img: "/media/41/images/thumb/Y1TJDBxJ.png",
    photos: ["/media/41/images/thumb/A6PmrnIF.png", "/media/41/images/thumb/Y1TJDBxJ.png", "/media/41/images/thumb/aZVksCio.png", "/media/41/images/thumb/k_om25e0.png", "/media/41/images/thumb/Bv3aDcDp.png", "/media/41/images/thumb/cNAezT-Q.png", "/media/41/images/thumb/2tEFM62n.png", "/media/41/images/thumb/luxWHpHX.png"],
    videos: ["Запуск двигателя", "Компрессия 1 цилиндр", "Компрессия 2 цилиндр", "Компрессия 3 цилиндр", "Давление масла", "Проверка гидродемпфера"],
    specs: [
      ["Год", "2018"], ["Тактность", "4-х тактный"], ["Кол-во цилиндров", "3"],
      ["Система подъема мотора", "ручная (демпфер)"], ["Длина ноги", "S (381 мм)"],
      ["Управление", "дистанционное"], ["Два стартера", "электрический и ручной"],
      ["Компрессия", "15/15/15"], ["Наработка", "302 моточаса"]
    ]
  },
  {
    brand: "suzuki", brandLabel: "Suzuki",
    title: "Suzuki DF100A (X), гидравлика (310115)",
    price: 590000,
    img: "/media/98/images/thumb/remaocuT.png",
    photos: ["/media/98/images/thumb/qBwJMxe-.png", "/media/98/images/thumb/remaocuT.png", "/media/98/images/thumb/faDxn5gg.png", "/media/98/images/thumb/tH5jIlNy.png", "/media/98/images/thumb/aA2PBBnp.png", "/media/98/images/thumb/7WNnjjW0.png"],
    videos: ["Запуск двигателя", "Компрессия 1 цилиндр", "Компрессия 2 цилиндр", "Компрессия 3 цилиндр", "Компрессия 4 цилиндр", "Давление масла", "Проверка гидроподъема"],
    specs: [
      ["Год", "2012"], ["Тактность", "4-х тактный"], ["Кол-во цилиндров", "4"],
      ["Длина ноги", "X (635 мм)"], ["Подъем", "гидравлический"],
      ["Управление", "дистанционное"], ["Компрессия", "14/14/14/14"], ["Наработка", "303 моточаса"]
    ]
  },

  // ---------- TOHATSU / MERCURY ----------
  {
    brand: "tohatsu", brandLabel: "Tohatsu / Mercury",
    title: "Tohatsu 15 (S), гидравлика, румпель (033996)",
    price: 180000,
    img: "/media/32/images/thumb/1zwCXwHC.jpeg",
    photos: ["/media/32/images/thumb/1zwCXwHC.jpeg", "/media/32/images/thumb/2xlj1wDG.jpeg", "/media/32/images/thumb/oXXhLgxI.jpeg", "/media/32/images/thumb/hUHb6tVV.jpeg", "/media/32/images/thumb/2g7A-NKF.jpeg", "/media/32/images/thumb/XB1zqIb8.jpeg"],
    videos: ["Запуск двигателя", "Запуск с кикстартера", "Компрессия 1 цилиндр", "Компрессия 2 цилиндр", "Проверка гидроподъема", "Давление масла"],
    specs: [
      ["Год", "2011"], ["Тактность", "4-тактный"], ["Система подъема мотора", "гидравлическая"],
      ["Длина ноги", "S (381 мм)"], ["Управление", "румпельное"],
      ["Два стартера", "ручной и электрический"], ["Компрессия", "14/14"]
    ]
  },
  {
    brand: "tohatsu", brandLabel: "Tohatsu / Mercury",
    title: "Tohatsu 15 (S), гидравлика, румпель (033998)",
    price: 180000,
    img: "/media/64/images/thumb/jRpDQr3v.jpeg",
    photos: ["/media/64/images/thumb/aQkElH1_.jpeg", "/media/64/images/thumb/jRpDQr3v.jpeg", "/media/64/images/thumb/C-n2qnON.jpeg", "/media/64/images/thumb/VBBSTPRe.jpeg", "/media/64/images/thumb/JfQkYRAj.jpeg"],
    videos: ["Запуск двигателя", "Запуск с ручного стартера", "Компрессия 1 цилиндр", "Компрессия 2 цилиндр", "Давление масла", "Проверка гидроподъема"],
    specs: [
      ["Год", "2010"], ["Тактность", "4-х тактный"], ["Кол-во цилиндров", "2"],
      ["Система подъема мотора", "гидравлическая"], ["Длина ноги", "S (381 мм)"],
      ["Компрессия", "14/14"], ["Управление", "румпельное"], ["Два стартера", "электрический и ручной"]
    ]
  },

  // ---------- ЗАПЧАСТИ ----------
  {
    brand: "parts", brandLabel: "Запчасти",
    title: "Румпель для лодочного мотора Yamaha F25",
    price: 10000,
    img: "/media/85/images/thumb/wJuZraNM.jpeg",
    specs: [["Совместимость", "Yamaha F25"], ["Наличие", "во Владивостоке"]]
  },
  {
    brand: "parts", brandLabel: "Запчасти",
    title: "Угловые колонки и транцевые узлы",
    price: 11111,
    img: "/media/53/images/thumb/2t9OAA2S.jpeg",
    specs: [["Подходит", "Volvo Penta 290/280, MerCruiser Alpha One/Bravo 2, Yanmar, Yamaha"], ["Наличие", "во Владивостоке"]]
  },
  {
    brand: "parts", brandLabel: "Запчасти",
    title: "Кожух дейдвуда для моторов Yamaha",
    price: 12000,
    img: "/media/58/images/thumb/G3LeOaCH.jpeg",
    specs: [["Совместимость", "Yamaha F30B, F40F, F50F, F50H, F60C, F70A"], ["Артикул", "6BG-42741-10-8D"]]
  },
  {
    brand: "parts", brandLabel: "Запчасти",
    title: "Мультирумпель Yamaha F30-F40, F50-F70, F80-F115",
    price: 15000,
    img: "/media/54/images/thumb/79v2lMHw.jpeg",
    specs: [["Совместимость", "Yamaha F30-F40, F50-F70, F80-F115"], ["Наличие", "во Владивостоке"]]
  },
  {
    brand: "parts", brandLabel: "Запчасти",
    title: "Мультирумпель Suzuki DF40, DF50, DF60",
    price: 20000,
    img: "/media/105/images/thumb/uxsutKWb.jpeg",
    specs: [["Совместимость", "Suzuki DF40, DF50, DF60"], ["Наличие", "во Владивостоке"]]
  },
  {
    brand: "parts", brandLabel: "Запчасти",
    title: "Мультирумпель Honda BF75, BF90",
    price: 30000,
    img: "/media/52/images/thumb/VQWgugho.jpeg",
    specs: [["Совместимость", "Honda BF75, BF90"], ["Наличие", "во Владивостоке"]]
  },
  {
    brand: "parts", brandLabel: "Запчасти",
    title: "Мультирумпель для лодочного мотора Honda BF60",
    price: 30000,
    img: "/media/109/images/thumb/iMDx1UYD.jpeg",
    specs: [["Состояние", "отличное"], ["Совместимость", "Honda BF60"]]
  },
  {
    brand: "parts", brandLabel: "Запчасти",
    title: "Дейдвуд Yamaha F40, F60",
    price: 35000,
    img: "/media/56/images/thumb/PYzAkL30.jpeg",
    specs: [["Артикул", "67C-45111-21-4D / 67C-45111-21-8D"], ["Наличие", "во Владивостоке"]]
  },
  {
    brand: "parts", brandLabel: "Запчасти",
    title: "Винт А6 и А7 (4-лопастной)",
    price: 35000,
    img: "/media/106/images/thumb/D7agLMdp.jpeg",
    specs: [["В наличии", "А6 — 1 шт, А7 — 1 шт"], ["Состояние", "отличное"]]
  },
  {
    brand: "parts", brandLabel: "Запчасти",
    title: "Транец выносной с гидроподъёмом",
    price: 57000,
    img: "/media/47/images/thumb/iq35LqnH.jpeg",
    specs: [["Для моторов", "до 70 л.с."], ["Особенность", "регулировка по высоте"]]
  },
  {
    brand: "parts", brandLabel: "Запчасти",
    title: "Дроссельная заслонка Yamaha F30, F40",
    price: 80000,
    img: "/media/81/images/thumb/0Cgb_8y0.png",
    specs: [["Артикул", "6BG-13750-03"], ["Наличие", "во Владивостоке"]]
  },
  {
    brand: "parts", brandLabel: "Запчасти",
    title: "Редуктор Suzuki DF 90-140 л.с.",
    price: 95000,
    img: "/media/57/images/thumb/-adabn5T.jpeg",
    specs: [["Состояние", "хорошее техническое"]]
  },
  {
    brand: "parts", brandLabel: "Запчасти",
    title: "Редуктор Suzuki DF90A",
    price: 110000,
    img: "/media/55/images/thumb/rOUUpqZr.jpeg",
    specs: [["Длина ноги", "L"], ["Особенность", "эксплуатировался в пресной воде"]]
  },
  {
    brand: "parts", brandLabel: "Запчасти",
    title: "Водомётная насадка",
    price: 110000,
    img: "/media/110/images/thumb/f3JF1gBr.jpeg",
    specs: [["Для моторов", "Yamaha F50, F60"], ["Нога", "S, L"], ["Материал", "импеллер, нержавейка"]]
  },
  {
    brand: "parts", brandLabel: "Запчасти",
    title: "Колонка рулевая Volvo Penta SX-RT1",
    price: 120000,
    img: "/media/59/images/thumb/8qL99rcH.jpeg",
    specs: [["Редукция", "2.18"], ["В комплекте", "винт"]]
  },
  {
    brand: "parts", brandLabel: "Запчасти",
    title: "Угловая колонка Yanmar SZ110",
    price: 120000,
    img: "/media/61/images/thumb/uRQcCPiD.jpeg",
    specs: [["В комплекте", "транцевый узел"], ["Наличие", "во Владивостоке"]]
  },
  {
    brand: "parts", brandLabel: "Запчасти",
    title: "Колонка Volvo Penta DP290",
    price: 300000,
    img: "/media/83/images/thumb/M9oHvYM8.jpeg",
    specs: [["В комплекте", "два винта, транцевый узел с гидроцилиндрами, масляный насос гидроподъёма"], ["Наличие", "во Владивостоке"]]
  }
];

var BRANDS = [
  { key: "all", label: "Все" },
  { key: "yamaha", label: "Yamaha" },
  { key: "honda", label: "Honda" },
  { key: "suzuki", label: "Suzuki" },
  { key: "tohatsu", label: "Tohatsu / Mercury" },
  { key: "parts", label: "Запчасти" }
];
