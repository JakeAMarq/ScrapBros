import { Hero } from "./Hero"

const Values = Object.freeze({
    instructions: {
        width: 370,

    }
})

enum Types {
    Hero,
    Cannon,
    Platform,
    Projectile,
    HealthPack,
    ManaPack,
    WinTile,
    Spike,
    InvisibleTile,
    Checkpoint
}

enum Directions {
    Left,
    Right
}


export { Types, Directions }