export default abstract class Model {
  constructor(model: {}) {
    Object.assign(this, model)
  }
}
