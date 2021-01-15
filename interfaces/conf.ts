export default interface ConfigType {
  name: string,
  port: 4100,
  mode: "development",
  protocol: "http",
  serverUrl: "localhost",
  serverUrlWebUrlLink: "localhost:4200/",
  database: {
    host: "localhost",
    username: "postgres",
    password: "postgres",
    database: "nectar_database",
    port: 5432
  },
  email: {
    host: string,
    port: 465,
    auth: {
      user: string,
      pass: string
    },
    secure: true
  }
}
