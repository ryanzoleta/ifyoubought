export const verticalLinePlugin = {
  id: 'verticalLine',
  //@ts-ignore
  afterDraw: (chart, args, options) => {
    if (chart.tooltip._active && chart.tooltip._active.length) {
      const activePoint = chart.tooltip._active[0];
      const ctx = chart.ctx;
      const x = activePoint.element.x;
      const topY = chart.scales.y.top;
      const bottomY = chart.scales.y.bottom;

      // draw line
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, topY);
      ctx.lineTo(x, bottomY);
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'hsla(142, 71%, 45%, 0.2)';
      ctx.stroke();
      ctx.restore();
    }
  }
};
