/**
 * Number.prototype.format(n, x, s, c)
 *
 * @param number  val: number to format
 * @param integer n: length of decimal
 * @param integer x: length of whole part
 * @param mixed   s: sections delimiter
 * @param mixed   c: decimal delimiter
 * @source http://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-money-in-javascript
 */
module.exports = function(val, n, x, s, c) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
        num = val.toFixed(Math.max(0, ~~n));

    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};