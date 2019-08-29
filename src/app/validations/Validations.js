class Validations {
  error = null;

  async isValid(schema, params) {
    var me = this;

    await schema.validate(params).catch(err => me.setError(err));
  }

  setError(msg) {
    this.error = msg;
  }

  getError() {
    return this.error;
  }

  sendError(res) {
    return res.status(401).json({ error: this.error.errors });
  }
}

export default Validations;