import pandas as pd

def infer_and_convert_data_types(df):
    inferred_data_types = {}
    for col in df.columns:
        # Attempt to convert to numeric first
        df_converted = pd.to_numeric(df[col], errors='coerce')
        if not df_converted.isna().all():  # If at least one value is numeric
            df[col] = df_converted
            inferred_data_types[col] = df[col].dtype.name
            continue

        # Attempt to convert to datetime
        try:
            df[col] = pd.to_datetime(df[col])
            inferred_data_types[col] = 'datetime64[ns]'
            continue
        except (ValueError, TypeError):
            pass

        # Check if the column should be categorical
        if len(df[col].unique()) / len(df[col]) < 0.5:  # Threshold for categorization
            df[col] = pd.Categorical(df[col])
            inferred_data_types[col] = 'category'
        else:
            inferred_data_types[col] = 'object'  # Default to object for text/mixed

    return df, inferred_data_types