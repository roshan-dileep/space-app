def read_sources(list):
    from google.oauth2.service_account import Credentials
    from googleapiclient.discovery import build

    SERVICE_ACCOUNT_FILE = 'service_account.json'  
    SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

   
    def Create_Service(service_account_file, scopes):
        
        creds = Credentials.from_service_account_file(service_account_file, scopes=scopes)

        service = build('sheets', 'v4', credentials=creds)
        return service


    service = Create_Service(SERVICE_ACCOUNT_FILE, SCOPES)


    spreadsheet_id = '1YsWrvZfImh-vq-Xfc32ES4t56APMnYs7g4F0wUbPhIk'


    range_name = 'Sheet1!A:A'  


    try:
        result = service.spreadsheets().values().get(
            spreadsheetId=spreadsheet_id,
            range=range_name
        ).execute()


        column_values = result.get('values', [])


        print(f"Retrieved values: {column_values}")


        if not column_values:
            print("No data found.")
        else:
            for row in column_values:
 
                print(f"Row: {row}")


                if row:  
                    print(f"Appending value: {row[0]}")  
                    list.append(row[0])  

    except Exception as e:
        print(f"An error occurred: {e}")
