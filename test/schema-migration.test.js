const schemaMigration = async () => {
  const options = {
    migrate: 'safe',
    service: app.service('catalog'),
    newSchema: schema
  };
  options.currentSchema = await app.service('catalog').Model.get('schema');
  const migrate = new Migration(options);
  migrate.convert();
  const commands = migrate.execute();
  return migrate;
};
