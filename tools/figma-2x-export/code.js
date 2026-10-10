const JOBS = [
  ["light-hero","878:11602"],["light-place","878:11690"],["light-planner","878:11695"],["light-route","878:11699"],["light-nearby","901:17090"],
  ["dark-hero","942:30388"],["dark-place","942:30398"],["dark-planner","942:30402"],["dark-route","942:30407"],["dark-nearby","942:30501"],
  ["card-light-route","901:16880"],["card-light-stop","901:16647"],["card-light-stats","901:17000"],["card-light-place","901:16768"],
  ["card-dark-route","942:30424"],["card-dark-stop","942:30429"],["card-dark-stats","942:30448"],["card-dark-place","942:30473"],
  ["card-light-d-stop","942:30103"],["card-light-d-stats","942:30122"],["card-light-m-place","942:29845"],
  ["pin-light-1","901:17093"],["pin-light-2","901:17094"],["pin-light-3","901:17095"],["pin-light-4","901:17096"],["pin-light-5","901:17097"],["pin-light-6","901:17098"],["pin-light-7","901:17099"],
  ["pin-dark-1","942:30504"],["pin-dark-2","942:30505"],["pin-dark-3","942:30506"],["pin-dark-4","942:30507"],["pin-dark-5","942:30508"],["pin-dark-6","942:30509"],["pin-dark-7","942:30510"]
];
figma.showUI(__html__, { width: 360, height: 160 });
(async () => {
  let done = 0, failed = [];
  for (const [name, id] of JOBS) {
    try {
      const node = await figma.getNodeByIdAsync(id);
      if (!node) throw new Error("node not found");
      const bytes = await node.exportAsync({ format: "PNG", constraint: { type: "SCALE", value: 2 } });
      figma.ui.postMessage({ name, bytes, w: node.width, h: node.height });
      done++;
    } catch (e) { failed.push(name + ": " + e.message); }
    figma.ui.postMessage({ progress: done + failed.length, total: JOBS.length });
  }
  figma.ui.postMessage({ finished: true, done, failed });
})();
