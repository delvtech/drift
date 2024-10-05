export class DriftError extends Error {
  static prefix = "✖ Drift:";
  private _name: string;

  constructor(error: any) {
    // Ensure the error can be converted into a primitive type which is required
    // for the `Error` constructor.
    try {
      String(error);
    } catch {
      throw error;
    }
    super(error?.message || error);
    this._name = `${DriftError.prefix}Drift Error`;
  }

  // Override the default getter/setter to ensure the prefix is always present
  get name() {
    return this._name;
  }
  set name(name: string) {
    this._name = `${DriftError.prefix}${name.replace(new RegExp(`^${DriftError.prefix}`), "")}`;
  }
}
