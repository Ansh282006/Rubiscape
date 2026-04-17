# API Testing Guide

## Create Pipeline
```bash
curl -X POST "http://localhost:8000/api/v1/execute?name=Test%20Pipeline"
```

## Check State
```bash
curl "http://localhost:8000/api/v1/state/{pipeline_id}"
```

## Transition State
```bash
curl -X POST "http://localhost:8000/api/v1/transition?pipeline_id={id}&to_state=RUNNING"
```

## Get Audit Trail
```bash
curl "http://localhost:8000/api/v1/audit/{pipeline_id}"
```
