import VacuumWorld from './vacuum-world/vacuum-world';

document.getElementById('startButton').addEventListener('click', () => {
    let world = new VacuumWorld(3, 3);
    world.run();
});
