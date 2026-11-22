export const categories = ['SUPER MATCHA', 'SUPER BORI', 'REFRESHERS', 'SOFT SERVE', 'COFFEE', 'BAKERY'];
export const categoryNames = ['말차', '보리', '에이드', '소프트 서브', '커피', '베이커리'];
const temperature = { name: '온도', label: 'TEMPERATURE', choices: ['ICE', 'HOT'] };
const sweetness = { name: '당도', label: 'SWEETNESS', choices: ['50%', '70%', '100%'] };
const milk = { name: '우유', label: 'MILK', choices: ['기본 우유', '오트 밀크'], extraPrice: { '오트 밀크': 500 } };
const size = { name: '크기', label: 'SIZE', choices: ['조각', '홀'], extraPrice: { '홀': 18300 } };
const latte = [temperature, sweetness, milk];
const vegan = [temperature, sweetness];
// shortcut: unspecified prices/options are coursework fixtures; confirm with the store before production.
const rows = [
  ['M01',0,'슈퍼말차 라떼','SUPER MATCHA LATTE',5800,'202603/f600ea94f32f2261de578d70b282879a.jpg',['BEST'],latte],
  ['M02',0,'슈퍼말차 브루드 티','SUPER MATCHA BREWED TEA',5300,'202603/cdb6507130bdb316d93b7b1662936704.jpg',['VEGAN'],vegan],
  ['M03',0,'코코넛 말차 라떼','COCONUT MATCHA LATTE',6300,'202603/f5f1f2dfac0c420316a0fb2ace0dc63c.jpg',['VEGAN'],vegan],
  ['M04',0,'말차 에스프레소 라떼','MATCHA ESPRESSO LATTE',6300,'202603/b250ce2f2c7a04dc993a6f4497d5b97c.jpg',[],latte],
  ['M05',0,'슈퍼말차 크러쉬','SUPER MATCHA CRUSH',6500,'202603/a4b42174a3bc5f37f0dc7723ef3ecf7f.jpg',[],[sweetness,milk]],
  ['M06',0,'오트 크림 말차 라떼','OAT CREAM MATCHA LATTE',6800,'202603/de36dbf5beb8e25e6f5746a437d964f0.jpg',['VEGAN'],[sweetness]],
  ['M07',0,'스트로베리 말차 라떼','STRAWBERRY MATCHA LATTE',6800,'202603/8c5d05e11aa2cb5c65857821e1a45c56.jpg',['NEW'],[sweetness,milk]],
  ['M08',0,'말차 소프트 라떼','MATCHA SOFT LATTE',6800,'202603/c4c3616d3b4fc31dd6e21dd3c0b46de8.jpg',['BEST'],[sweetness]],
  ['B01',1,'슈퍼보리 라떼','SUPER BORI LATTE',5800,'202603/60d92b9396219466a942842211017fd3.jpg',['BEST'],latte],
  ['B02',1,'슈퍼보리 블랙','SUPER BORI BLACK',5300,'202603/c64162b7037328471d94349aa5b47f4d.jpg',['VEGAN'],vegan],
  ['B03',1,'오트 크림 보리 라떼','OAT CREAM BORI LATTE',6300,'202603/8febcc787383118061fccb7cf0959d11.jpg',['VEGAN'],[sweetness]],
  ['B04',1,'슈퍼보리 아인슈페너','SUPER BORI EINSPÄNNER',6300,'202604/6e9fc53999a5f027e1f7d009ea0fa638.jpg',['NEW'],[sweetness]],
  ['B05',1,'보리 소프트 라떼','BORI SOFT LATTE',6800,'202604/8e5f921f91b47571abaa7f9ca2bfe30e.jpg',[],[sweetness]],
  ['R01',2,'퓨어 레몬 에이드','PURE LEMON ADE',5800,'202611/62e3ef617810dd1b625b5be27c27c48d.jpg',[],[sweetness]],
  ['R02',2,'말차 레몬 에이드','MATCHA LEMON ADE',6300,'202611/fdd4dcf16fb6c8611d3f941feafbdb10.png',[],[sweetness]],
  ['S01',3,'말차 소프트 서브','MATCHA SOFT SERVE',4500,'202603/724c7a05c23e87caa69aca99d8f43b10.jpg',[],[]],
  ['S02',3,'백미 소프트 서브','RICE SOFT SERVE',4500,'202603/496dd3707891e566a89a08bec5c3796c.jpg',[],[]],
  ['S03',3,'말차 & 백미 소프트 서브','MATCHA & RICE SOFT SERVE',4500,'202603/ac11ba46e5fe185c6324245654ab6581.jpg',['BEST'],[]],
  ['C01',4,'아메리카노','AMERICANO',4500,'202611/d9dbf74a82b91d0b18d88032e0353895.png',[],[temperature]],
  ['C02',4,'카페 라떼','CAFE LATTE',5000,'202603/3c0e33bd7a56849a8be5c6454c01dddc.jpg',[],[temperature,milk]],
  ['K01',5,'블랙 롤케이크','BLACK ROLL CAKE',6600,'202603/b6be6989d77afaed50fcbbd37abd7426.jpg',[],[size]],
  ['K02',5,'딸기 롤케이크','STRAWBERRY ROLL CAKE',6600,'202603/a005fbc38f79dc9f386263063a639659.jpg',[],[size]],
  ['K03',5,'코코넛 말차 샌드','COCONUT MATCHA SAND',3500,'202603/3c8b86837886d0d39ce24bc73ca85b54.jpg',[],[]],
  ['K04',5,'에스프레소 말차 샌드','ESPRESSO MATCHA SAND',3500,'202603/2ba13f3d0c4654b5d99183a8948fbcef.jpg',[],[]],
  ['K05',5,'엑스트라 말차 샌드','EXTRA MATCHA SAND',3500,'202603/8171e3817654365364298812ce421fec.jpg',[],[]],
  ['K06',5,'라이스 보리 샌드','RICE BORI SAND',3500,'202604/df547e8b858a8fb8ac2e5ffb576e9fb0.jpg',[],[]],
  ['K07',5,'밤 보리 샌드','CHESTNUT BORI SAND',3500,'202604/ae081085b978e6610317067f3edfd743.jpg',[],[]],
  ['K08',5,'팥 보리 샌드','RED BEAN BORI SAND',3500,'202604/8eafdea4a3d379fbc45956377dd78fed.jpg',[],[]],
];
export const menus = rows.map(([id, category, name, nameEn, price, image, tags, options]) => ({
  id, category: categories[category], name, nameEn, price,
  image: `https://supermatcha.com/web/product/medium/${image}`, tags, options,
}));
