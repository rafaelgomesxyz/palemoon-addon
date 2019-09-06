# Pale Moon Addon Action

This action will publish your addon to the Pale Moon Addon store.

## Usage

See [action.yml](action.yml)

```yaml
steps:
  - uses: rafaelgssa/palemoon-addon@v1
    with:
      slug: my-addon-slug
      xpi: build/my-addon.xpi
      username: ${{ secrets.PALEMOON_USERNAME }}
      password: ${{ secrets.PALEMOON_PASSWORD }}
```

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
