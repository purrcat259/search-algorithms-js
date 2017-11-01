import BreadthFirstVacuum from './vacuum-world/breadth-first-vacuum';

document.getElementById('startButton').addEventListener('click', () => {
    let breadthFirstVacuum = new BreadthFirstVacuum(2, 2);
    breadthFirstVacuum.run();
});
