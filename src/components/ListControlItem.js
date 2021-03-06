def((Button, Confirm) => class extends Button {
  init() {
    this.text = this.title;
  }
  onClick() {
    this.confirm ? Confirm.popup(this.confirm, this.depot).then(result => result && this.exec()) : this.exec();
  }
  get exec() { return this[this.method + 'Action'] || this.defaultAction; }
  goAction() {
    let { module, key, params, _blank, target, title, depot } = this;
    let { scheme, where } = depot;
    params = refactor(params, { params: depot.params, scheme, where });
    if (_blank) target = '_blank';
    return depot.go({ args: { module, key, params }, target, title });
  }
  createAction() {
    let { depot } = this;
    this.module = 'editor';
    this.key = depot.key;
    this.params = this.params || depot.params;
    this.goAction();
  }
  openAction() {
    let { depot } = this;
    let { queryParams, resolvedKey } = depot;
    let url = api.resolvePath([ resolvedKey, this.href ]);
    open(`${url}?${queryParams}`);
  }
  defaultAction() {
    let { depot } = this;
    let path = [ depot.resolvedKey ];
    if ('api' in this) path.push(this.api);
    api(path, { method: this.method || 'POST' }).then(() => {
      depot.refresh();
    }, error => {
      alert(error.message);
    });
  }
  get styleSheet() {
    return `
      :scope {
        display: inline-block;
        margin-left: 1em;
        min-width: 64px;
        min-height: 32px;
        &:first-child {
          margin-left: 0;
        }
      }
    `;
  }
});
