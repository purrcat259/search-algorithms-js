import BreadthFirstVacuum from './vacuum-world/breadth-first-vacuum';
import DepthFirstVacuum from './vacuum-world/depth-first-vacuum';
import DepthLimitedVacuum from './vacuum-world/depth-limited-vacuum';

document.getElementById('startButton').addEventListener('click', () => {
    // let vacuum = new BreadthFirstVacuum(2, 2);
    // let vacuum = new DepthFirstVacuum(2, 2);
    let vacuum = new DepthLimitedVacuum(2, 2);
    vacuum.run();
});
