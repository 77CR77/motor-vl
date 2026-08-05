// ===== МОТОР-ВЛ: данные каталога =====
// Полный перечень моторов и запчастей, как на действующем сайте motor-vl.ru.
// Фотографии подключены напрямую с действующего сайта как временная заглушка
// для демонстрации вёрстки. Перед публикацией рекомендуем загрузить
// собственные изображения на хостинг сайта.

var MOTORS = [
  // ---------- YAMAHA ----------
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F25 (S), румпельное управление",
    price: 250000, badge: "Хит продаж",
    img: "https://www.motor-vl.ru/media/38/images/thumb/91M0tfSx.png",
    specs: [
      ["Год", "2008"], ["Тактность", "4-тактный"], ["Цилиндров", "2"],
      ["Подъём мотора", "ручной"], ["Длина ноги", "S (381 мм)"],
      ["Управление", "румпель"], ["Компрессия", "14 / 14"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F25 (S), гидравлика, пульт управления",
    price: 270000,
    img: "https://www.motor-vl.ru/media/37/images/thumb/eFiTTmsZ.png",
    specs: [
      ["Год", "2008"], ["Тактность", "4-тактный"], ["Цилиндров", "2"],
      ["Подъём мотора", "гидравлический"], ["Длина ноги", "S (381 мм)"],
      ["Управление", "дистанционное"], ["Компрессия", "15 / 15"], ["В комплекте", "пульт управления"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F25 (S), румпель, гидродемпфер",
    price: 270000,
    img: "https://www.motor-vl.ru/media/73/images/thumb/ITVB1rfv.jpeg",
    specs: [
      ["Год", "2019"], ["Тактность", "4-тактный"], ["Цилиндров", "2"],
      ["Подъём мотора", "ручной (гидродемпфер)"], ["Длина ноги", "S (381 мм)"],
      ["Управление", "румпель"], ["Компрессия", "15 / 15"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F25 (S), гидроподъём, пульт управления",
    price: 350000,
    img: "https://www.motor-vl.ru/media/76/images/thumb/nvJaBjdE.jpeg",
    specs: [
      ["Год", "2018"], ["Тактность", "4-тактный"], ["Цилиндров", "2"],
      ["Управление", "дистанционное"], ["Подъём мотора", "гидравлический"], ["Длина ноги", "S (381 мм)"],
      ["Компрессия", "15 / 15"], ["Стартеры", "электрический и ручной"], ["В комплекте", "машинка"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F60 (L), гидравлика, пульт управления",
    price: 380000,
    img: "https://www.motor-vl.ru/media/103/images/thumb/3gOvJDFx.jpeg",
    specs: [
      ["Год", "2008"], ["Тактность", "4-тактный"], ["Цилиндров", "4"],
      ["Подъём мотора", "гидравлический"], ["Длина ноги", "L (508 мм)"],
      ["Управление", "дистанционное"], ["Компрессия", "16 / 16 / 16 / 16"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F25 EFI (L), гидродемпфер",
    price: 390000,
    img: "https://www.motor-vl.ru/media/30/images/thumb/QsLNLtS8.jpeg",
    specs: [
      ["Год", "2023"], ["Тактность", "4-тактный"], ["Цилиндров", "3"],
      ["Длина ноги", "L, можно переделать в S"], ["Компрессия", "14 / 14"],
      ["Стартеры", "электрический и ручной"], ["Наработка", "50 моточасов"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F80 (L), гидравлика, пульт управления",
    price: 430000,
    img: "https://www.motor-vl.ru/media/51/images/thumb/l4JxVrAF.jpeg",
    specs: [
      ["Год", "2008"], ["Тактность", "4-тактный"], ["Цилиндров", "4"],
      ["Подъём мотора", "гидравлический"], ["Длина ноги", "L (508 мм)"],
      ["Компрессия", "15 / 15 / 15 / 15"], ["Давление масла", "5 кг"], ["В комплекте", "пульт управления"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F30 EFI (S), гидравлика, машинка",
    price: 460000,
    img: "https://www.motor-vl.ru/media/26/images/thumb/otp8Jy52.png",
    specs: [
      ["Год", "2017"], ["Тактность", "4-тактный"], ["Цилиндров", "3"],
      ["Подъём мотора", "гидравлический"], ["Длина ноги", "S (381 мм)"],
      ["Управление", "дистанционное"], ["Компрессия", "15 / 15 / 15"], ["Наработка", "682 моточаса"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F60 EFI (L), гидравлика, пульт управления",
    price: 460000,
    img: "https://www.motor-vl.ru/media/89/images/thumb/fzsa4oKt.jpeg",
    specs: [
      ["Год", "2012"], ["Подъём мотора", "гидравлический"], ["Длина ноги", "L (508 мм)"],
      ["Управление", "дистанционное"], ["Компрессия", "15 / 15 / 15 / 15"], ["Наработка", "825 моточасов"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F30 EFI (L), пульт управления",
    price: 470000,
    img: "https://www.motor-vl.ru/media/63/images/thumb/QLWd18se.jpeg",
    specs: [
      ["Год", "2017"], ["Тактность", "4-тактный"], ["Цилиндров", "3"],
      ["Подъём мотора", "гидравлический"], ["Длина ноги", "L (508 мм)"],
      ["Компрессия", "15 / 15 / 15"], ["Наработка", "415 моточасов"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F30 EFI (S), гидродемпфер, пульт управления",
    price: 470000,
    img: "https://www.motor-vl.ru/media/75/images/thumb/mm0qBOBG.png",
    specs: [
      ["Год", "2018"], ["Тактность", "4-тактный"], ["Цилиндров", "3"],
      ["Компрессия", "15 / 15 / 15"], ["Подъём мотора", "ручной (гидродемпфер)"],
      ["Управление", "дистанционное"], ["Длина ноги", "S (381 мм)"], ["Наработка", "459 моточасов"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F40 EFI (S), гидроподъём, пульт управления",
    price: 490000,
    img: "https://www.motor-vl.ru/media/92/images/thumb/WY6L_aO4.jpeg",
    specs: [
      ["Год", "2019"], ["Тактность", "4-тактный"], ["Длина ноги", "S (381 мм)"],
      ["Управление", "дистанционное"], ["Подъём мотора", "гидравлический"],
      ["Компрессия", "15 / 15 / 15"], ["Наработка", "559 моточасов"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F40 EFI (S), гидравлика, пульт управления",
    price: 500000,
    img: "https://www.motor-vl.ru/media/24/images/thumb/t7dr0J99.jpeg",
    specs: [
      ["Год", "2019"], ["Тактность", "4-тактный"], ["Цилиндров", "3"],
      ["Длина ноги", "S (381 мм)"], ["Управление", "дистанционное"], ["Подъём мотора", "гидравлический"],
      ["Компрессия", "15 / 15 / 15"], ["Наработка", "220 моточасов"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F90 EFI (L), гидравлика",
    price: 520000,
    img: "https://www.motor-vl.ru/media/86/images/thumb/8T3_y5g5.jpeg",
    specs: [
      ["Год", "2012"], ["Тактность", "4-тактный"], ["Длина ноги", "L (508 мм)"],
      ["Управление", "дистанционное"], ["Подъём мотора", "гидравлический"],
      ["Компрессия", "16 / 16 / 16 / 16"], ["Наработка", "795 моточасов"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F90 EFI (L), гидравлика",
    price: 520000,
    img: "https://www.motor-vl.ru/media/88/images/thumb/8IZE9Pej.jpeg",
    specs: [
      ["Год", "2011"], ["Тактность", "4-тактный"], ["Цилиндров", "4"],
      ["Подъём мотора", "гидравлический"], ["Компрессия", "16 / 16 / 16 / 16"],
      ["Длина ноги", "L (508 мм)"], ["Управление", "дистанционное"], ["Наработка", "675 моточасов"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F90 EFI (L), гидравлика, пульт управления",
    price: 650000,
    img: "https://www.motor-vl.ru/media/50/images/thumb/A3_1DHjZ.png",
    specs: [
      ["Год", "2016"], ["Подъём мотора", "гидравлический"], ["Длина ноги", "L (508 мм)"],
      ["Компрессия", "16 / 16 / 16 / 16"], ["Управление", "дистанционное"], ["Наработка", "812 моточасов"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F115 EFI (X)",
    price: 650000,
    img: "https://www.motor-vl.ru/media/79/images/thumb/DVVOYJUF.png",
    specs: [
      ["Год", "2013"], ["Тактность", "4-тактный"], ["Цилиндров", "4"],
      ["Подъём мотора", "гидравлический"], ["Длина ноги", "X (635 мм)"],
      ["Компрессия", "16 / 16 / 16 / 16"], ["Управление", "дистанционное"], ["Наработка", "499 моточасов"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F115 (X), гидравлика, пульт управления",
    price: 670000,
    img: "https://www.motor-vl.ru/media/94/images/thumb/1ByXI8QA.png",
    specs: [
      ["Год", "2010"], ["Подъём мотора", "гидравлический"], ["Длина ноги", "X (635 мм)"],
      ["Управление", "дистанционное"], ["Компрессия", "16 / 16 / 16 / 16"], ["Наработка", "285 моточасов"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F40 EFI (L), новый мотор из Японии",
    price: 690000, badge: "Новый",
    img: "https://www.motor-vl.ru/media/100/images/thumb/Mqq3VMFq.jpeg",
    specs: [
      ["Год", "2024"], ["Тактность", "4-тактный"], ["Цилиндров", "3"],
      ["Подъём мотора", "гидравлический"], ["Длина ноги", "L (508 мм)"],
      ["В комплекте", "мультирумпель, топливный бак, шланг"], ["Особенность", "можно установить ногу S"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F60 EFI (L), новый лодочный мотор",
    price: 740000, badge: "Новый",
    img: "https://www.motor-vl.ru/media/49/images/thumb/huTnmVc0.jpeg",
    specs: [
      ["Год", "2025"], ["Тактность", "4-тактный"], ["Цилиндров", "4"],
      ["Подъём мотора", "гидравлический"], ["Длина ноги", "L (508 мм)"], ["Управление", "дистанционное"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F130 EFI (X)",
    price: 780000,
    img: "https://www.motor-vl.ru/media/62/images/thumb/XwPbk3kn.jpeg",
    specs: [
      ["Год", "2019"], ["Тактность", "4-тактный"], ["Цилиндров", "4"],
      ["Подъём мотора", "гидравлический"], ["Длина ноги", "X (635 мм)"],
      ["Управление", "дистанционное"], ["Компрессия", "15 / 15 / 15 / 15"], ["Наработка", "372 моточаса"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F150 (X), привезён из Японии",
    price: 790000,
    img: "https://www.motor-vl.ru/media/29/images/thumb/i3tK8dO1.jpeg",
    specs: [
      ["Год", "2014"], ["Тактность", "4-тактный"], ["Подъём мотора", "гидравлический"],
      ["Длина ноги", "X (635 мм)"], ["Управление", "дистанционное"], ["Наработка", "975 моточасов"],
      ["Особенность", "в России не эксплуатировался"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F200 (X), гидравлика",
    price: 840000,
    img: "https://www.motor-vl.ru/media/90/images/thumb/wa5wWMJr.jpeg",
    specs: [
      ["Год", "2010"], ["Тактность", "4-тактный"], ["Подъём мотора", "гидравлический"],
      ["Длина ноги", "X (635 мм)"], ["Управление", "дистанционное"], ["Наработка", "857 моточасов"],
      ["Компрессия", "14 / 14 / 14 / 14 / 14 / 14"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F150 (L), гидравлика",
    price: 850000,
    img: "https://www.motor-vl.ru/media/25/images/thumb/pgWrcYVa.jpeg",
    specs: [
      ["Год", "2014"], ["Длина ноги", "L (508 мм)"], ["Управление", "дистанционное"],
      ["Подъём мотора", "гидравлический"], ["Компрессия", "15 / 15 / 15 / 15"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F150 (L), гидравлика",
    price: 850000,
    img: "https://www.motor-vl.ru/media/48/images/thumb/YEaQXb09.png",
    specs: [
      ["Год", "2014"], ["Тактность", "4-тактный"], ["Цилиндров", "4"],
      ["Подъём мотора", "гидравлический"], ["Длина ноги", "L (508 мм)"],
      ["Управление", "дистанционное"], ["Наработка", "587 моточасов"], ["Компрессия", "16 / 16 / 16 / 16"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F90 EFI (L), новый мотор",
    price: 1150000, badge: "Новый",
    img: "https://www.motor-vl.ru/media/95/images/thumb/od5CRLE4.jpeg",
    specs: [
      ["Состояние", "новый, из японского дилерского центра"], ["Тактность", "4-тактный"],
      ["Длина ноги", "L (508 мм)"], ["Управление", "дистанционное"], ["Наработка", "0 моточасов"]
    ]
  },
  {
    brand: "yamaha", brandLabel: "Yamaha",
    title: "Yamaha F150 EFI (X), новый мотор",
    price: 1450000, badge: "Новый",
    img: "https://www.motor-vl.ru/media/93/images/thumb/ukHSOg8C.jpeg",
    specs: [
      ["Год", "2023"], ["Тактность", "4-тактный"], ["Длина ноги", "X (635 мм)"],
      ["Подъём мотора", "гидравлический"], ["Управление", "дистанционное"], ["Винт", "из нержавеющей стали"]
    ]
  },

  // ---------- HONDA ----------
  {
    brand: "honda", brandLabel: "Honda",
    title: "Honda BF75 (L), гидравлика, пульт управления",
    price: 520000,
    img: "https://www.motor-vl.ru/media/34/images/thumb/rehurjC1.jpeg",
    specs: [
      ["Год", "2015"], ["Тактность", "4-тактный"], ["Цилиндров", "4"],
      ["Подъём мотора", "гидравлический"], ["Длина ноги", "L (508 мм)"],
      ["Управление", "дистанционное"], ["Компрессия", "16 / 16 / 16 / 16"], ["В комплекте", "пульт управления"]
    ]
  },
  {
    brand: "honda", brandLabel: "Honda",
    title: "Honda BF75 EFI (L), гидравлика, пульт управления",
    price: 570000,
    img: "https://www.motor-vl.ru/media/33/images/thumb/y3WrhUIp.jpeg",
    specs: [
      ["Год", "2017"], ["Тактность", "4-тактный"], ["Цилиндров", "4"],
      ["Подъём мотора", "гидравлический"], ["Длина ноги", "L (508 мм)"],
      ["Управление", "дистанционное"], ["Компрессия", "16 / 16 / 16 / 16"], ["В комплекте", "пульт управления"]
    ]
  },
  {
    brand: "honda", brandLabel: "Honda",
    title: "Honda BF50, новый лодочный мотор из Японии",
    price: 680000, badge: "Новый",
    img: "https://www.motor-vl.ru/media/70/images/thumb/DyKbxOyV.png",
    specs: [
      ["Год", "2026"], ["Тактность", "4-тактный"], ["Длина ноги", "L (508 мм)"], ["Управление", "дистанционное"]
    ]
  },

  // ---------- SUZUKI ----------
  {
    brand: "suzuki", brandLabel: "Suzuki",
    title: "Suzuki DF30 EFI (S), гидродемпфер",
    price: 390000,
    img: "https://www.motor-vl.ru/media/41/images/thumb/Y1TJDBxJ.png",
    specs: [
      ["Год", "2018"], ["Тактность", "4-тактный"], ["Цилиндров", "3"],
      ["Подъём мотора", "ручной (демпфер)"], ["Длина ноги", "S (381 мм)"],
      ["Управление", "дистанционное"], ["Стартеры", "электрический и ручной"],
      ["Компрессия", "15 / 15 / 15"], ["Наработка", "302 моточаса"]
    ]
  },
  {
    brand: "suzuki", brandLabel: "Suzuki",
    title: "Suzuki DF100A (X), гидравлика",
    price: 590000,
    img: "https://www.motor-vl.ru/media/98/images/thumb/remaocuT.png",
    specs: [
      ["Год", "2012"], ["Тактность", "4-тактный"], ["Цилиндров", "4"],
      ["Длина ноги", "X (635 мм)"], ["Подъём мотора", "гидравлический"],
      ["Управление", "дистанционное"], ["Компрессия", "14 / 14 / 14 / 14"], ["Наработка", "303 моточаса"]
    ]
  },

  // ---------- TOHATSU / MERCURY ----------
  {
    brand: "tohatsu", brandLabel: "Tohatsu / Mercury",
    title: "Tohatsu 15 (S), гидравлика, румпель",
    price: 180000,
    img: "https://www.motor-vl.ru/media/32/images/thumb/1zwCXwHC.jpeg",
    specs: [
      ["Год", "2011"], ["Тактность", "4-тактный"], ["Подъём мотора", "гидравлический"],
      ["Длина ноги", "S (381 мм)"], ["Управление", "румпельное"],
      ["Стартеры", "ручной и электрический"], ["Компрессия", "14 / 14"]
    ]
  },
  {
    brand: "tohatsu", brandLabel: "Tohatsu / Mercury",
    title: "Tohatsu 15 (S), гидравлика, румпель",
    price: 180000,
    img: "https://www.motor-vl.ru/media/64/images/thumb/jRpDQr3v.jpeg",
    specs: [
      ["Год", "2010"], ["Тактность", "4-тактный"], ["Цилиндров", "2"],
      ["Подъём мотора", "гидравлический"], ["Длина ноги", "S (381 мм)"],
      ["Компрессия", "14 / 14"], ["Управление", "румпельное"], ["Стартеры", "электрический и ручной"]
    ]
  },

  // ---------- ЗАПЧАСТИ ----------
  {
    brand: "parts", brandLabel: "Запчасти",
    title: "Румпель для лодочного мотора Yamaha F25",
    price: 10000,
    img: "https://www.motor-vl.ru/media/85/images/thumb/wJuZraNM.jpeg",
    specs: [["Совместимость", "Yamaha F25"], ["Наличие", "во Владивостоке"]]
  },
  {
    brand: "parts", brandLabel: "Запчасти",
    title: "Угловые колонки и транцевые узлы",
    price: 11111,
    img: "https://www.motor-vl.ru/media/53/images/thumb/2t9OAA2S.jpeg",
    specs: [["Подходит", "Volvo Penta 290/280, MerCruiser Alpha One/Bravo 2, Yanmar, Yamaha"], ["Наличие", "во Владивостоке"]]
  },
  {
    brand: "parts", brandLabel: "Запчасти",
    title: "Кожух дейдвуда для моторов Yamaha",
    price: 12000,
    img: "https://www.motor-vl.ru/media/58/images/thumb/G3LeOaCH.jpeg",
    specs: [["Совместимость", "Yamaha F30B, F40F, F50F, F50H, F60C, F70A"], ["Артикул", "6BG-42741-10-8D"]]
  },
  {
    brand: "parts", brandLabel: "Запчасти",
    title: "Мультирумпель Yamaha F30-F40, F50-F70, F80-F115",
    price: 15000,
    img: "https://www.motor-vl.ru/media/54/images/thumb/79v2lMHw.jpeg",
    specs: [["Совместимость", "Yamaha F30-F40, F50-F70, F80-F115"], ["Наличие", "во Владивостоке"]]
  },
  {
    brand: "parts", brandLabel: "Запчасти",
    title: "Мультирумпель Suzuki DF40, DF50, DF60",
    price: 20000,
    img: "https://www.motor-vl.ru/media/105/images/thumb/uxsutKWb.jpeg",
    specs: [["Совместимость", "Suzuki DF40, DF50, DF60"], ["Наличие", "во Владивостоке"]]
  },
  {
    brand: "parts", brandLabel: "Запчасти",
    title: "Мультирумпель Honda BF75, BF90",
    price: 30000,
    img: "https://www.motor-vl.ru/media/52/images/thumb/VQWgugho.jpeg",
    specs: [["Совместимость", "Honda BF75, BF90"], ["Наличие", "во Владивостоке"]]
  },
  {
    brand: "parts", brandLabel: "Запчасти",
    title: "Мультирумпель для лодочного мотора Honda BF60",
    price: 30000,
    img: "https://www.motor-vl.ru/media/109/images/thumb/iMDx1UYD.jpeg",
    specs: [["Состояние", "отличное"], ["Совместимость", "Honda BF60"]]
  },
  {
    brand: "parts", brandLabel: "Запчасти",
    title: "Дейдвуд Yamaha F40, F60",
    price: 35000,
    img: "https://www.motor-vl.ru/media/56/images/thumb/PYzAkL30.jpeg",
    specs: [["Артикул", "67C-45111-21-4D / 67C-45111-21-8D"], ["Наличие", "во Владивостоке"]]
  },
  {
    brand: "parts", brandLabel: "Запчасти",
    title: "Винт А6 и А7 (4-лопастной)",
    price: 35000,
    img: "https://www.motor-vl.ru/media/106/images/thumb/D7agLMdp.jpeg",
    specs: [["В наличии", "А6 — 1 шт, А7 — 1 шт"], ["Состояние", "отличное"]]
  },
  {
    brand: "parts", brandLabel: "Запчасти",
    title: "Транец выносной с гидроподъёмом",
    price: 57000,
    img: "https://www.motor-vl.ru/media/47/images/thumb/iq35LqnH.jpeg",
    specs: [["Для моторов", "до 70 л.с."], ["Особенность", "регулировка по высоте"]]
  },
  {
    brand: "parts", brandLabel: "Запчасти",
    title: "Дроссельная заслонка Yamaha F30, F40",
    price: 80000,
    img: "https://www.motor-vl.ru/media/81/images/thumb/0Cgb_8y0.png",
    specs: [["Артикул", "6BG-13750-03"], ["Наличие", "во Владивостоке"]]
  },
  {
    brand: "parts", brandLabel: "Запчасти",
    title: "Редуктор Suzuki DF 90-140 л.с.",
    price: 95000,
    img: "https://www.motor-vl.ru/media/57/images/thumb/-adabn5T.jpeg",
    specs: [["Состояние", "хорошее техническое"]]
  },
  {
    brand: "parts", brandLabel: "Запчасти",
    title: "Редуктор Suzuki DF90A",
    price: 110000,
    img: "https://www.motor-vl.ru/media/55/images/thumb/rOUUpqZr.jpeg",
    specs: [["Длина ноги", "L"], ["Особенность", "эксплуатировался в пресной воде"]]
  },
  {
    brand: "parts", brandLabel: "Запчасти",
    title: "Водомётная насадка",
    price: 110000,
    img: "https://www.motor-vl.ru/media/110/images/thumb/f3JF1gBr.jpeg",
    specs: [["Для моторов", "Yamaha F50, F60"], ["Нога", "S, L"], ["Материал", "импеллер, нержавейка"]]
  },
  {
    brand: "parts", brandLabel: "Запчасти",
    title: "Колонка рулевая Volvo Penta SX-RT1",
    price: 120000,
    img: "https://www.motor-vl.ru/media/59/images/thumb/8qL99rcH.jpeg",
    specs: [["Редукция", "2.18"], ["В комплекте", "винт"]]
  },
  {
    brand: "parts", brandLabel: "Запчасти",
    title: "Угловая колонка Yanmar SZ110",
    price: 120000,
    img: "https://www.motor-vl.ru/media/61/images/thumb/uRQcCPiD.jpeg",
    specs: [["В комплекте", "транцевый узел"], ["Наличие", "во Владивостоке"]]
  },
  {
    brand: "parts", brandLabel: "Запчасти",
    title: "Колонка Volvo Penta DP290",
    price: 300000,
    img: "https://www.motor-vl.ru/media/83/images/thumb/M9oHvYM8.jpeg",
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
