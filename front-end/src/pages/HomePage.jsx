import Typography  from "@mui/material/Typography";

export default function Homepage(){

  function getLocalStorageItems() {
    const result = []
    for(let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i)
      const value = window.localStorage.getItem(key)
      result.push({ key, value })
    }
    return result
  }

  function getCookies() {
    const result = []
    if(document.cookie) {
      document.cookie.split(';').forEach(cookie => {
        const [name, value] = cookie.trim().split('=')
        result.push({ name, value })
      })
    }
    return result
  }

  const localStorageItems = getLocalStorageItems()
  const cookies = getCookies()

  const cellStyle = {
    border: '1px solid gray',
    padding: '4px'
  }

  return (
      <>
        {/*gutterBottom coloca um espaçamento extra abaixo do componente */}
        <Typography variant="h1" gutterBottom>
          Bem-vindo(a) ao sistema Karangos
        </Typography>

        <Typography variant="h2" gutterBottom>
          <em>Local storage</em>
        </Typography>
        <table style={{
          border: '1px solid grey',
          borderCollapse: 'collapse'
        }}>
          <tr>
            <th style={cellStyle}>Item</th>
            <th style={cellStyle}>Valor</th>
          </tr>
          {
            localStorageItems.length > 0 && localStorageItems.map(item => {
              return <tr key={item.key}>
                <td style={cellStyle}>{item.key}</td>
                <td style={cellStyle}>{item.value}</td>
              </tr>
            })
          }
          {
            localStorageItems.length == 0 &&
            <Typography variant="body1">
              (Nada a exibir)
            </Typography>
          }
        </table>

        <Typography variant="h2" gutterBottom>
          <em>Cookies</em>
        </Typography>
        <table style={{
          border: '1px solid grey',
          borderCollapse: 'collapse'
        }}>
          <tr>
            <th style={cellStyle}>Nome</th>
            <th style={cellStyle}>Valor</th>
          </tr>
          {
            cookies.length > 0 && cookies.map(cookie => {
              return <tr key={cookie.name}>
                <td style={cellStyle}>{cookie.name}</td>
                <td style={cellStyle}>{cookie.value}</td>
              </tr>
            })
          }
          {
            cookies.length == 0 &&
            <Typography variant="body1">
              (Nada a exibir)
            </Typography>
          }
        </table>

      </>
  )
}