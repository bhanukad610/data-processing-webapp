import pandas as pd
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def infer_and_convert_data_types(df):
    """
    Infers and converts data types in a Pandas DataFrame.
    
    Args:
    df (pd.DataFrame): The input DataFrame to infer and convert data types for.
    
    Returns:
    tuple: A tuple containing the modified DataFrame and a dictionary of inferred data types.
    """
    inferred_data_types = {}

    for col in df.columns:
        if df[col].isna().all():
            logger.info(f"Skipping column '{col}' as it is empty or contains only NaN values.")
            inferred_data_types[col] = 'object'
            continue

        df_converted = pd.to_numeric(df[col], errors='coerce')
        if not df_converted.isna().all():
            df[col] = df_converted
            inferred_data_types[col] = df[col].dtype.name
            logger.info(f"Column '{col}' inferred as '{df[col].dtype.name}' (numeric).")
            continue

        try:
            df[col] = pd.to_datetime(df[col], errors='coerce')
            if not df[col].isna().all():
                inferred_data_types[col] = 'datetime64[ns]'
                logger.info(f"Column '{col}' inferred as 'datetime64[ns]'.")
                continue
            else:
                df[col] = df[col].astype(str)
        except (ValueError, TypeError) as e:
            logger.warning(f"Column '{col}' failed datetime conversion: {e}")

        unique_ratio = len(df[col].unique()) / len(df[col])
        if unique_ratio < 0.5:  # Threshold for categorization
            df[col] = pd.Categorical(df[col])
            inferred_data_types[col] = 'category'
            logger.info(f"Column '{col}' inferred as 'category'.")
        else:
            inferred_data_types[col] = 'object'
            logger.info(f"Column '{col}' defaulted to 'object'.")

    return df, inferred_data_types