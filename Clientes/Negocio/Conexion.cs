using MySql.Data.MySqlClient;

namespace Clientes.Negocio
{
    //public class Conexion
    //{
    //    private readonly string connectionString;

    //    string server = "helbert.info";
    //    string database = "clientesbanca";
    //    string username = "ClienteDb";
    //    string password = "DbCliente";



    //    public Conexion()
    //    {
    //        connectionString = $"Server={this.server};Database={this.database};Uid={this.username};Pwd={this.password};";
    //    }

    //    public MySqlConnection ObtenerConexion()
    //    {
    //        return new MySqlConnection(connectionString);
    //    }

    //}

    //Para integrar el patrón Singleton en tu proyecto, puedes aplicarlo en la clase
    //Conexion para asegurarte de que solo exista una única instancia de la conexión a
    //la base de datos en toda la aplicación. Aquí tienes una implementación del patrón
    //Singleton en la clase Conexion:
    public class Conexion
    {
        private static Conexion _instance;  // Variable estática que almacenará la única instancia de la clase
        private readonly string connectionString;  // Cadena de conexión a la base de datos

        string server = "helbert.info";  // Nombre del servidor de la base de datos
        string database = "clientesbanca";  // Nombre de la base de datos
        string username = "ClienteDb";  // Nombre de usuario para acceder a la base de datos
        string password = "DbCliente";  // Contraseña para acceder a la base de datos

        private Conexion()
        {
            connectionString = $"Server={this.server};Database={this.database};Uid={this.username};Pwd={this.password};";  // Construcción de la cadena de conexión
        }

        public static Conexion Instance
        {
            get
            {
                if (_instance == null)  // Verificación de si la instancia ya ha sido creada
                {
                    _instance = new Conexion();  // Creación de la instancia si no existe
                }
                return _instance;  // Devolución de la instancia existente o recién creada
            }
        }

        public MySqlConnection ObtenerConexion()
        {
            return new MySqlConnection(connectionString);  // Creación y devolución de una nueva instancia de conexión a la base de datos
        }
    }

}
