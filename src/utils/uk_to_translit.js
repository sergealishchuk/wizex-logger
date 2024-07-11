
module.exports = (src) => {

  let source = (typeof (src) === 'string') ? [str] : src;
  let res = [];

  var uk = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
    'е': 'e', 'ё': 'e', 'ж': 'j', 'з': 'z', 'и': 'i',
    'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
    'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh',
    'щ': 'shch', 'ы': 'y', 'э': 'e', 'ю': 'u', 'я': 'ya',
    'і': 'i', 'ї': 'yi', '-': '-', 'є': 'e'
  }, n_str = [];

  for (let index = 0; index < source.length; ++index) {
    let str = source[index]
      .replace(/[ъь]+/g, '')
      .replace(/[й\'\"]/g, 'i')
      .replace(/\s+/g, '-');

    let n_str = [];

    for (var i = 0; i < str.length; ++i) {
      let t = uk[str[i]];
      n_str.push(t ? t : str[i]);
    }
    res.push(n_str.join(''));
  }

  return typeof (src) === 'string' ? res[0] : res;
};
